"use client";
import { useParams } from "next/navigation";
import { ClassAttendance } from "@/components/dashboard/ClassAttendance";
export default function ClassAttendancePage() { const params = useParams<{ classId: string }>(); return <ClassAttendance classId={params.classId} />; }
