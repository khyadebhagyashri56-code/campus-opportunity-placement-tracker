
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Please log in first." },
        { status: 401 }
      );
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return NextResponse.json(
        { message: "Server configuration error." },
        { status: 500 }
      );
    }

    const secretKey = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, secretKey);
    const userId = Number(payload.sub);

    if (!Number.isSafeInteger(userId) || userId <= 0) {
      return NextResponse.json(
        { message: "Invalid session." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const attemptId = Number(id);

    if (!Number.isSafeInteger(attemptId) || attemptId <= 0) {
      return NextResponse.json(
        { message: "Invalid interview ID." },
        { status: 400 }
      );
    }

    const attempt = await prisma.interviewAttempt.findFirst({
      where: {
        id: attemptId,
        userId,
      },
      include: {
        answers: {
          orderBy: { questionNumber: "asc" },
          select: {
            id: true,
            question: true,
            answer: true,
            questionNumber: true,
          },
        },
      },
    });

    if (!attempt) {
      return NextResponse.json(
        { message: "Interview attempt not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ attempt });
  } catch (error) {
    console.error("Load interview details error:", error);

    return NextResponse.json(
      { message: "Unable to load interview details." },
      { status: 500 }
    );
  }
}
