
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.$connect();

    const userCount = await prisma.user.count();

    return NextResponse.json({
      success: true,
      message: "PostgreSQL connected successfully!",
      totalUsers: userCount,
    });
  } catch (error) {
    console.error("Database connection error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed.",
      },
      { status: 500 }
    );
  }
}
