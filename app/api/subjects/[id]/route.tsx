import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

interface Props{
  params: { id: string }
}

export async function GET(req: NextRequest, {params}: Props){
  const id = (await params).id;
  const subject = await prisma.subject.findUnique({
    where: {id: parseInt(id)}
  })
  if(!subject){
    return NextResponse.json({message: "Subject not found"}, {status: 404})
  }
  return NextResponse.json(subject);
}

export async function PUT(req: NextRequest, {params}: Props){
  const body = await req.json();
  const { name, difficulty, userId } = body;

  const id = (await params).id;
   
  const checkUser = await prisma.user.findUnique({
    where: {id: userId}
  })

  if(!checkUser){
    return NextResponse.json({message: "User not found!!"}, {status: 404})
  }
  const subject = await prisma.subject.update({
    where: {id: parseInt(id)},
    data: {
      name,
      difficulty
    }
  })
  return NextResponse.json({message: "Subject updated successfully", subject})
}

export async function DELETE(req: NextRequest, {params}: Props){
  const id = (await params).id;

  const subject = await prisma.subject.findUnique({
    where: {id: parseInt(id)}
  })
  if(!subject){
    return NextResponse.json({message: "Subject not found!!"}, {status: 404})
  }
  
  const deletedSubject = await prisma.subject.delete({
    where: {id: parseInt(id)}
  })
  return NextResponse.json({message: "Subject deleted!!", deletedSubject})
}