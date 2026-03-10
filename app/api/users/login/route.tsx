import prisma from "@/prisma/client";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

//Login user
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 })
  }
  const user = await prisma.user.findUnique({
    where: { email }
  })
  if (!user) {
    return NextResponse.json({ message: "User doesn't exits of this email!" }, { status: 400 })
  }

  const isMatched = await bcrypt.compare(password, user.password);
  if (!isMatched) {
    return NextResponse.json({ message: "Password doesn't match!! Please try again!!" }, { status: 400 })
  }
  return NextResponse.json({message: "Login sucess!!", user: {id: user.id, email: user.email}})
}

