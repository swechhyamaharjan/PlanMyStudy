import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { checkAuth } from "@/utils/checkAuth";

export async function GET(req: NextRequest) {
  let user;
  try {
    ({ user } = await checkAuth(req));
  } catch (err) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const exams = await prisma.exam.findMany({
    where: {
      subject: {
        userId: user.id
      }
    },
    include: {
      subject: true
    }
  });
  return NextResponse.json(exams);
}

export async function POST(req: NextRequest) {
  let user;
  try {
    ({ user } = await checkAuth(req));
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { examDate, subjectId } = body;

  const checkSubject = await prisma.subject.findUnique({
    where: { id: subjectId, userId: user.id }
  })
  if (!checkSubject) {
    return NextResponse.json({ message: "Subject not found or unauthorized" }, { status: 404 })
  }

  const exam = await prisma.exam.create({
    data: {
      examDate: new Date(examDate),
      subjectId,
    }
  })
  return NextResponse.json({ message: "Exam inserted sucess!!", exam }, { status: 201 })
}