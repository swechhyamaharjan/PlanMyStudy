import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { checkAuth } from "@/utils/checkAuth";

export async function PUT(req: NextRequest) {
  let userId: number;
  try {
    const { user } = await checkAuth(req);
    userId = user.id;
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { name, email } = await req.json();

  if (!name && !email) {
    return NextResponse.json({ message: "Provide at least one field" }, { status: 400 });
  }

  // check if email is being changed, check it's not already taken
  if (email) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing && existing.id !== userId) {
      return NextResponse.json({ message: "Email already in use" }, { status: 400 });
    }
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(name && { name }),
      ...(email && { email }),
    },
    select: { id: true, name: true, email: true },
  });

  return NextResponse.json({ message: "Profile updated successfully", user: updated });
}