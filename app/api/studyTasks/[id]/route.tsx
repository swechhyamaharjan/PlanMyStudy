import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
 
interface Props {
  params: { id: string };
}
 
// Update study task
export async function PUT(req: NextRequest, { params }: Props) {
  const id = (await params).id;
  const body = await req.json();
  const { title, taskDate, subjectId, completed } = body;
 
  const checkSubject = await prisma.subject.findUnique({
    where: { id: subjectId },
  });
  if (!checkSubject) {
    return NextResponse.json({ message: "Subject not found" }, { status: 404 });
  }
 
  const updatedTask = await prisma.studyTask.update({
    where: { id: parseInt(id) },
    data: {
      title,
      taskDate: new Date(taskDate),
      subjectId,
      completed,
    },
  });
 
  return NextResponse.json(
    { message: "Task updated successfully", updatedTask },
    { status: 200 }
  );
}
 
// Delete study task
export async function DELETE(req: NextRequest, { params }: Props) {
  const id = (await params).id;
 
  await prisma.studyTask.delete({
    where: { id: parseInt(id) },
  });
 
  return NextResponse.json({ message: "Task deleted successfully" });
}
 