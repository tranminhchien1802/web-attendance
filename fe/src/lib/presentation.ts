export const courseColors = ["#49439C", "#167D8D", "#3D6BB3", "#9C6830", "#7D529B", "#2D7E69"];
export function courseColor(id: string) { return courseColors[Array.from(id).reduce((sum, c) => sum + c.charCodeAt(0), 0) % courseColors.length]; }
export function courseImage(id: string) { if (/WEB|UI|AI|NET|CSDL|HTTT|ATTT/.test(id)) return "/images/dashboard-lab-team.png"; if (/KT|QTKD|TMDT|PPNC/.test(id)) return "/images/dashboard-lecture-hall.png"; return "/images/plt-login-learning-hub.png"; }
export function formatDate(value: string) { const date = new Date(`${value}T12:00:00`); return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }); }
