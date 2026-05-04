import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { checkAuth } from "@/utils/checkAuth";

interface Props {
  params: { id: string }
}

//update exam
export async function PUT(req: NextRequest, { params }: Props) {
  const id = (await params).id;
  let user;
  try {
    ({ user } = await checkAuth(req));
  } catch (err) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { examDate, subjectId } = body;

  // Verify the subject belongs to this user
  const checkSubject = await prisma.subject.findUnique({
    where: { id: subjectId, userId: user.id }
  })
  if (!checkSubject) {
    return NextResponse.json({ message: "Subject not found or unauthorized" }, { status: 404 })
  }

  // Verify the exam belongs to this user's subject
  const checkExam = await prisma.exam.findFirst({
    where: { id: parseInt(id), subject: { userId: user.id } }
  })
  if (!checkExam) {
    return NextResponse.json({ message: "Exam not found or unauthorized" }, { status: 404 })
  }

  const updateExam = await prisma.exam.update({
    where: { id: parseInt(id) },
    data: {
      examDate: new Date(examDate),
      subjectId
    }
  })
  return NextResponse.json({ message: "Exam updated successfully!!", updateExam }, { status: 200 })
}

//delete exam
export async function DELETE(req: NextRequest, { params }: Props) {
  const id = (await params).id;
  let user;
  try {
    ({ user } = await checkAuth(req));
  } catch (err) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Verify the exam belongs to this user's subject
  const checkExam = await prisma.exam.findFirst({
    where: { id: parseInt(id), subject: { userId: user.id } }
  })
  if (!checkExam) {
    return NextResponse.json({ message: "Exam not found or unauthorized" }, { status: 404 })
  }

  await prisma.exam.delete({
    where: { id: parseInt(id) }
  })
  return NextResponse.json({ message: "Exam deleted successfully" })
}