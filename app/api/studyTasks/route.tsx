import prisma from "@/prisma/client";
import { NextResponse, NextRequest } from "next/server";

//Get all studyTasks
export async function GET(req: NextRequest){
  const studyTasks = await prisma.studyTask.findMany({
    include: {
      user: true,
      subject: true
    }
  })
  return NextResponse.json(studyTasks)
}

//Create a study task
export async function POST(req: NextRequest){
  const body = await req.json();
  const {title, taskDate, userId, subjectId, completed} = body;
  
  if (!title || !taskDate || !userId || !subjectId ){
    return NextResponse.json({message: "Missing fields"},  {status: 400})
  }
   const checkUser = await prisma.user.findUnique({
    where: {id: userId}
  })
  if(!checkUser){
    return NextResponse.json({message: "User not found"},  {status: 404})
  }
  const checkSubject = await prisma.subject.findUnique({
    where: {id: subjectId}
  })
  if(!checkSubject){
    return NextResponse.json({message: "Subject not found"},  {status: 404})
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
  return NextResponse.json({message: "StudyTask created successfully", studyTask}, {status: 201})
  }
