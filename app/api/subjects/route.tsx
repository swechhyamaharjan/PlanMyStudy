import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

//Get all subjects
export async function GET(req: NextRequest){
  const subjects = await prisma.subject.findMany({
    include: {
      user: {select: 
        {id: true, name: true, email: true}
      },
      exams: true
    }
  });
  return NextResponse.json(subjects);
}

//Create a subject 
export async function POST(req: NextRequest){
  const body = await req.json();
  const {name, difficulty, userId} = body;

  if (!name || !difficulty || !userId ){
    return NextResponse.json({message: "Missing fields!!"}, {status: 400})
  }

  const checkUser = await prisma.user.findUnique({
    where: {id: userId}
  })

  if(!checkUser){
    return NextResponse.json({message: "User not found"}, {status: 404})
  }

  const subject = await prisma.subject.create({
    data: {
      name,
      difficulty,
      user: {
        connect: {id: userId}
      }
    }
  })
  return NextResponse.json({message: "Subject added successfully", subject}, {status: 201});
}
