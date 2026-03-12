import jwt from "jsonwebtoken"
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

const JWT_SECRET = process.env.JWT_SECRET!;

interface AuthUser{
  id: number,
  name: string,
  email: string
}

export async function checkAuth(req: NextRequest): Promise<{user: AuthUser}>{
  const token = req.cookies.get("jwt")?.value;
    if (!token) throw new Error("Unauthorized User");
  try {
    //DECODE JWT
   const decoded = jwt.verify(token, JWT_SECRET) as {id: number}

   const user = await prisma.user.findUnique({
    where: {id: decoded.id}
   })

   if (!user) throw new Error("User not found");

   return{
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    }
   }
  } catch (error) {
     throw new Error("Invalid token");
  }
}
