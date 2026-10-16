import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import prisma from "@/lib/prisma";

const ALLOWED_TYPES = [
  "Technical Interview",
  "HR Interview",
  "Database Interview",
];

export async function POST(request) {
  try {
    // 1. Verify logged-in user
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Please log in first." },
        { status: 401 },
      );
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return NextResponse.json(
        { message: "Server configuration error." },
        { status: 500 },
      );
    }

    const secretKey = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, secretKey);
    const userId = Number(payload.sub);

    if (!Number.isSafeInteger(userId) || userId <= 0) {
      return NextResponse.json(
        { message: "Invalid session." },
        { status: 401 },
      );
    }

    // 2. Read submitted interview data
    const body = await request.json();
    const { interviewType, score, totalMarks, answers } = body;

    if (
      !ALLOWED_TYPES.includes(interviewType) ||
      !Number.isInteger(score) ||
      !Number.isInteger(totalMarks) ||
      totalMarks <= 0 ||
      score < 0 ||
      score > totalMarks ||
      !Array.isArray(answers) ||
      answers.length === 0 ||
      answers.length > 50
    ) {
      return NextResponse.json(
        { message: "Invalid interview data." },
        { status: 400 },
      );
    }

    // 3. Validate each answer
    const validAnswers = answers.every(
      (item) =>
        item &&
        typeof item.question === "string" &&
        item.question.trim().length > 0 &&
        item.question.length <= 5000 &&
        typeof item.answer === "string" &&
        item.answer.length <= 10000 &&
        Number.isInteger(item.questionNumber) &&
        item.questionNumber > 0,
    );

    if (!validAnswers) {
      return NextResponse.json(
        { message: "One or more answers are invalid." },
        { status: 400 },
      );
    }

    const questionNumbers = answers.map((item) => item.questionNumber);

    if (new Set(questionNumbers).size !== questionNumbers.length) {
      return NextResponse.json(
        { message: "Duplicate question numbers are not allowed." },
        { status: 400 },
      );
    }

    // 4. Save interview and answers together
    const attempt = await prisma.interviewAttempt.create({
      data: {
        interviewType,
        score,
        totalMarks,
        completed: true,
        userId,
        answers: {
          create: answers.map((item) => ({
            question: item.question.trim(),
            answer: item.answer.trim(),
            questionNumber: item.questionNumber,
          })),
        },
      },
      include: {
        answers: true,
      },
    });

    return NextResponse.json(
      {
        message: "Interview result saved successfully.",
        attempt,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Save interview error:", error);

    if (error?.code === "P2003") {
      return NextResponse.json(
        { message: "User account was not found." },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { message: "Unable to save interview result." },
      { status: 500 },
    );
  }
}

export async function GET(request) {
  try {
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Please log in first." },
        { status: 401 },
      );
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return NextResponse.json(
        { message: "Server configuration error." },
        { status: 500 },
      );
    }

    const secretKey = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, secretKey);
    const userId = Number(payload.sub);

    if (!Number.isSafeInteger(userId) || userId <= 0) {
      return NextResponse.json(
        { message: "Invalid session." },
        { status: 401 },
      );
    }

    const attempts = await prisma.interviewAttempt.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
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

    return NextResponse.json({ attempts });
  } catch (error) {
    console.error("Load interview history error:", error);

    return NextResponse.json(
      { message: "Unable to load interview history." },
      { status: 500 },
    );
  }
}
