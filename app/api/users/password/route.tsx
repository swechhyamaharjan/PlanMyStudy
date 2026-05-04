import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { checkAuth } from "@/utils/checkAuth";
import bcrypt from "bcryptjs";

export async function PUT(req: NextRequest) {
  let userId: number;
  try {
    const { user } = await checkAuth(req);
    userId = user.id;
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { currentPassword, newPassword } = await req.json();

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  if (newPassword.length < 6) {
    return NextResponse.json({ message: "Password must be at least 6 characters" }, { status: 400 });
  }

  // Get full user record to check password
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  // Verify current password
  const isMatched = await bcrypt.compare(currentPassword, user.password);
  if (!isMatched) {
    return NextResponse.json({ message: "Current password is incorrect" }, { status: 400 });
  }

  // Hash and save new password
  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashed },
  });

  return NextResponse.json({ message: "Password changed successfully" });
}