import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

interface Props{
  params: {id: string}
}

//update exam
export async function PUT(req: NextRequest, { params }: Props){
  const id = (await params).id;
  const body = await req.json();
  const {examDate, subjectId} = body;

  const checkSubject = await prisma.subject.findUnique({
    where: {id: subjectId}
  })
  if(!checkSubject){
    return NextResponse.json({message: "Subject not found"}, {status: 404})
  }
  const updateExam = await prisma.exam.update({
    where: {id: parseInt(id)},
    data: {
      examDate: new Date(examDate),
      subjectId
    }
  })
  return NextResponse.json({message: "Exam updated successfully!!", updateExam}, {status: 200})
}

//delete exam
export async function DELETE(req: NextRequest, { params }: Props){
  const id = (await params).id;
  await prisma.exam.delete({
    where: {id: parseInt(id)}
  })
  return NextResponse.json({message: "Exam deleted successfully"})
}