import type { AttendanceStatus, RosterStudent } from "@/lib/portalData";

type AttendanceExportRow = RosterStudent & { status: AttendanceStatus | undefined };

function xmlEscape(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function crc32(bytes: Uint8Array) {
  let crc = 0xffffffff;
  for (let index = 0; index < bytes.length; index += 1) {
    const byte = bytes[index];
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function concatBytes(parts: Uint8Array[]) {
  const result = new Uint8Array(parts.reduce((size, part) => size + part.length, 0));
  let offset = 0;
  parts.forEach((part) => { result.set(part, offset); offset += part.length; });
  return result;
}

function makeZip(files: { name: string; text: string }[]) {
  const encoder = new TextEncoder();
  const localParts: Uint8Array[] = [];
  const directoryParts: Uint8Array[] = [];
  let offset = 0;
  const viewOf = (size: number, fill: (view: DataView) => void) => {
    const bytes = new Uint8Array(size);
    fill(new DataView(bytes.buffer));
    return bytes;
  };

  for (const file of files) {
    const name = encoder.encode(file.name);
    const data = encoder.encode(file.text);
    const checksum = crc32(data);
    const header = viewOf(30, (view) => {
      view.setUint32(0, 0x04034b50, true); view.setUint16(4, 20, true); view.setUint16(6, 0x0800, true);
      view.setUint16(8, 0, true); view.setUint16(10, 0, true); view.setUint16(12, 0x0021, true);
      view.setUint32(14, checksum, true); view.setUint32(18, data.length, true); view.setUint32(22, data.length, true);
      view.setUint16(26, name.length, true); view.setUint16(28, 0, true);
    });
    localParts.push(header, name, data);

    const directory = viewOf(46, (view) => {
      view.setUint32(0, 0x02014b50, true); view.setUint16(4, 20, true); view.setUint16(6, 20, true);
      view.setUint16(8, 0x0800, true); view.setUint16(10, 0, true); view.setUint16(12, 0, true); view.setUint16(14, 0x0021, true);
      view.setUint32(16, checksum, true); view.setUint32(20, data.length, true); view.setUint32(24, data.length, true);
      view.setUint16(28, name.length, true); view.setUint16(30, 0, true); view.setUint16(32, 0, true);
      view.setUint16(34, 0, true); view.setUint16(36, 0, true); view.setUint32(38, 0, true); view.setUint32(42, offset, true);
    });
    directoryParts.push(directory, name);
    offset += header.length + name.length + data.length;
  }

  const directory = concatBytes(directoryParts);
  const local = concatBytes(localParts);
  const end = viewOf(22, (view) => {
    view.setUint32(0, 0x06054b50, true); view.setUint16(4, 0, true); view.setUint16(6, 0, true);
    view.setUint16(8, files.length, true); view.setUint16(10, files.length, true);
    view.setUint32(12, directory.length, true); view.setUint32(16, local.length, true); view.setUint16(20, 0, true);
  });
  return new Blob([local, directory, end], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
}

function inlineCell(reference: string, value: string) {
  return `<c r="${reference}" t="inlineStr"><is><t xml:space="preserve">${xmlEscape(value)}</t></is></c>`;
}

export function exportAttendanceXlsx(className: string, classCode: string, date: string, students: AttendanceExportRow[]) {
  const statusLabels: Record<AttendanceStatus, string> = { present: "Có mặt", absent: "Vắng", excused: "Có phép" };
  const headings = ["STT", "Mã sinh viên", "Họ và tên", "Email", "Trạng thái"];
  const rows = [
    `<row r="1">${headings.map((label, index) => inlineCell(`${String.fromCharCode(65 + index)}1`, label)).join("")}</row>`,
    `<row r="2">${inlineCell("A2", "Lớp")}${inlineCell("B2", className)}${inlineCell("C2", "Mã lớp")}${inlineCell("D2", classCode)}${inlineCell("E2", "Ngày")}${inlineCell("F2", date)}</row>`,
    ...students.map((student, index) => {
      const rowNumber = index + 4;
      return `<row r="${rowNumber}"><c r="A${rowNumber}"><v>${index + 1}</v></c>${inlineCell(`B${rowNumber}`, student.studentId)}${inlineCell(`C${rowNumber}`, student.fullName)}${inlineCell(`D${rowNumber}`, student.email)}${inlineCell(`E${rowNumber}`, student.status ? statusLabels[student.status] : "Chưa điểm danh")}</row>`;
    }),
  ];
  const sheet = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><dimension ref="A1:F${students.length + 3}"/><sheetViews><sheetView workbookViewId="0"/></sheetViews><sheetFormatPr defaultRowHeight="19"/><cols><col min="1" max="1" width="8" customWidth="1"/><col min="2" max="2" width="18" customWidth="1"/><col min="3" max="3" width="28" customWidth="1"/><col min="4" max="4" width="34" customWidth="1"/><col min="5" max="6" width="20" customWidth="1"/></cols><sheetData>${rows.join("")}</sheetData><autoFilter ref="A1:E${students.length + 3}"/></worksheet>`;
  const files = [
    { name: "[Content_Types].xml", text: `<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>` },
    { name: "_rels/.rels", text: `<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>` },
    { name: "xl/workbook.xml", text: `<?xml version="1.0" encoding="UTF-8"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Điểm danh" sheetId="1" r:id="rId1"/></sheets></workbook>` },
    { name: "xl/_rels/workbook.xml.rels", text: `<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>` },
    { name: "xl/worksheets/sheet1.xml", text: sheet },
  ];
  const blob = makeZip(files);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `Diem-danh-${classCode}-${date}.xlsx`;
  anchor.click();
  URL.revokeObjectURL(url);
}
