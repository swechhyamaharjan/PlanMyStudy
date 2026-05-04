import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { checkAuth } from "@/utils/checkAuth";

interface Props {
  params: { id: string }
}

export async function GET(req: NextRequest, { params }: Props) {
  const id = (await params).id;
  let user;
  try {
    ({ user } = await checkAuth(req));
  } catch (err) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const subject = await prisma.subject.findUnique({
    where: { id: parseInt(id), userId: user.id }
  })
  if (!subject) {
    return NextResponse.json({ message: "Subject not found or unauthorized" }, { status: 404 })
  }
  return NextResponse.json(subject);
}

export async function PUT(req: NextRequest, { params }: Props) {
  const id = (await params).id;
  let user;
  try {
    ({ user } = await checkAuth(req));
  } catch (err) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { name, difficulty } = await req.json();

  if (!name || !difficulty) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  const checkSubject = await prisma.subject.findUnique({
    where: { id: parseInt(id), userId: user.id }
  })

  if (!checkSubject) {
    return NextResponse.json({ message: "Subject not found or unauthorized" }, { status: 404 });
  }

  const updated = await prisma.subject.update({
    where: { id: parseInt(id) },
    data: { name, difficulty },
  });

  return NextResponse.json({ message: "Subject updated", updated });
}

export async function DELETE(req: NextRequest, { params }: Props) {
  const id = (await params).id;
  let user;
  try {
    ({ user } = await checkAuth(req));
  } catch (err) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const subject = await prisma.subject.findUnique({
    where: { id: parseInt(id), userId: user.id }
  })
  if (!subject) {
    return NextResponse.json({ message: "Subject not found or unauthorized" }, { status: 404 })
  }

  const deletedSubject = await prisma.subject.delete({
    where: { id: parseInt(id) }
  })
  return NextResponse.json({ message: "Subject deleted!!", deletedSubject })
}