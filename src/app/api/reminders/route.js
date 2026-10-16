import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import prisma from "@/lib/prisma";

async function getLoggedInUser(request) {
  try {
    const token = request.cookies.get("auth_token")?.value;

    if (!token || !process.env.JWT_SECRET) {
      return null;
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const userId = Number(payload.sub);

    if (!Number.isInteger(userId) || userId <= 0) {
      return null;
    }

    return userId;
  } catch {
    return null;
  }
}

// GET: Load logged-in user's reminders
export async function GET(request) {
  try {
    const userId = await getLoggedInUser(request);

    if (!userId) {
      return NextResponse.json(
        { message: "Please log in to view reminders." },
        { status: 401 },
      );
    }

    const reminders = await prisma.reminder.findMany({
      where: { userId },
      orderBy: { date: "asc" },
    });

    return NextResponse.json({ reminders });
  } catch (error) {
    console.error("GET reminders error:", error);

    return NextResponse.json(
      { message: "Failed to load reminders." },
      { status: 500 },
    );
  }
}

// POST: Create a reminder
export async function POST(request) {
  try {
    const userId = await getLoggedInUser(request);

    if (!userId) {
      return NextResponse.json(
        { message: "Please log in to create reminders." },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { title, company, type, date, notes } = body;

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof type !== "string" ||
      !type.trim() ||
      typeof date !== "string" ||
      !Number.isFinite(Date.parse(date))
    ) {
      return NextResponse.json(
        { message: "Title, type, and a valid date are required." },
        { status: 400 },
      );
    }

    if (
      (company != null && typeof company !== "string") ||
      (notes != null && typeof notes !== "string")
    ) {
      return NextResponse.json(
        { message: "Company and notes must be text." },
        { status: 400 },
      );
    }

    const reminder = await prisma.reminder.create({
      data: {
        title: title.trim(),
        company: company?.trim() || null,
        type: type.trim(),
        date: new Date(date),
        notes: notes?.trim() || null,
        userId,
      },
    });

    return NextResponse.json(
      { message: "Reminder created successfully.", reminder },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST reminders error:", error);

    return NextResponse.json(
      { message: "Failed to create reminder." },
      { status: 500 },
    );
  }
}
