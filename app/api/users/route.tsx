import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

//Get all users
export async function GET(req: NextRequest){
  const users = await prisma.user.findMany({
    include: {subjects: true, studyTasks: true}
  });
  return NextResponse.json(users);
}

//Register a new user
export async function POST(req: NextRequest){
  const body = await req.json();

  if (!body.name || !body.email || !body.password){
    return NextResponse.json({message: "Missing fields"}, {status: 400})
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(body.password, salt);

  const user = await prisma.user.create({
    data: {
      ...body,
      password: hashedPassword
    }
  })
  return NextResponse.json({message: "User created", user}, {status: 201})
}




