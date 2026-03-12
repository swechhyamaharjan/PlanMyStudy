import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const res = NextResponse.json({ message: "Logged out successfully" });
  res.cookies.set("jwt", "", { maxAge: 0 });
  return res;
}