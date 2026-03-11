import prisma from "@/prisma/client";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

interface Props{
  params: Promise<{id: String}>
}

//Get user by id
export async function GET(req: NextRequest, {params}: Props){
  const id = (await params).id;
  const user = await prisma.user.findUnique({
    where: { id: parseInt(id)}
  })
  return NextResponse.json(user);
}

//Update user by id
export async function PUT(req: NextRequest, {params}: Props){
  const id = (await params).id;
  const body = await req.json();
  const { name, email, password } = body;

  let updatedData: any = { name, email }

  if(password) {
    const hashedPassword = await bcrypt.hash(password, 10)
    updatedData.password = hashedPassword;
  }

  const user = await prisma.user.update({
    where: {id: parseInt(id)},
    data: updatedData
  })

  return NextResponse.json({message: "User updated", user});
}

//Delete user by id
export async function DELETE(req: NextRequest, {params}: Props){
  const id = (await params).id;
  const user = await prisma.user.delete({
    where: {id: parseInt(id)}
  })
  return NextResponse.json({message: "User deleted!!", user})
}







