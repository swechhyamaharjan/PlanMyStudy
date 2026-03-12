import jwt from "jsonwebtoken"
import { NextResponse } from "next/server";

interface Props {
  userId: number,
  email?: string;
}
const JWT_SECRET: string = process.env.JWT_SECRET!;

export function createToken({ userId, email }: Props) {
  const token = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' })

  const res = NextResponse.json({
    message: "Login success!!", user: { id: userId, email },
  });

  res.cookies.set("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV != "development",
    sameSite: "strict",
    maxAge: 3 * 24 * 60 * 60,
  });
  return res;
}