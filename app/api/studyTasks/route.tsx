import prisma from "@/prisma/client";
import { NextResponse, NextRequest } from "next/server";
import { checkAuth } from "@/utils/checkAuth";

//Get all studyTasks
export async function GET(req: NextRequest) {
  const studyTasks = await prisma.studyTask.findMany({
    include: {
      user: true,
      subject: true
    }
  })
  return NextResponse.json(studyTasks)
}

//Create a study task
export async function POST(req: NextRequest) {
  let userId: number;
  try {
    const { user } = await checkAuth(req);
    userId = user.id;
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, taskDate, subjectId, completed } = body;

  if (!title || !taskDate || !subjectId) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 })
  }

  const checkSubject = await prisma.subject.findUnique({
    where: { id: subjectId }
  })
  if (!checkSubject) {
    return NextResponse.json({ message: "Subject not found" }, { status: 404 })
  }

  const studyTask = await prisma.studyTask.create({
    data: {
      title,
      taskDate: new Date(taskDate),
      userId,
      subjectId,
      completed
    }
  })
  return NextResponse.json({ message: "StudyTask created successfully", studyTask }, { status: 201 })
}
