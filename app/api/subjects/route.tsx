import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { checkAuth } from "@/utils/checkAuth";

//Get all subjects
export async function GET(req: NextRequest) {
  const subjects = await prisma.subject.findMany({
    include: {
      user: {
        select:
          { id: true, name: true, email: true }
      },
      exams: true
    }
  });
  return NextResponse.json(subjects);
}

//Create a subject 
export async function POST(req: NextRequest) {
  const body = await req.json();
  let user;

  try {
    ({ user } = await checkAuth(req));
  } catch (err: any) {
    // If token is missing or invalid
    return NextResponse.json(
      { message: "Please login first!!" },
      { status: 401 }
    );
  }

  const { name, difficulty } = body;

  if (!name || !difficulty) {
    return NextResponse.json({ message: "Missing fields!!" }, { status: 400 })
  }

  const subject = await prisma.subject.create({
    data: {
      name,
      difficulty,
      user: {
        connect: { id: user.id }
      }
    }
  })
  return NextResponse.json({ message: "Subject added successfully", subject }, { status: 201 });
}
