import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import prisma from "@/lib/prisma";

async function getLoggedInUser(request) {
  try {
    const token = request.cookies.get("auth_token")?.value;

    if (!token || !process.env.JWT_SECRET) return null;

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const userId = Number(payload.sub);

    return Number.isInteger(userId) && userId > 0 ? userId : null;
  } catch {
    return null;
  }
}

// PATCH: Update reminder completion status
export async function PATCH(request, { params }) {
  try {
    const userId = await getLoggedInUser(request);

    if (!userId) {
      return NextResponse.json({ message: "Please log in." }, { status: 401 });
    }

    const { id } = await params;
    const reminderId = Number(id);

    if (!Number.isInteger(reminderId) || reminderId <= 0) {
      return NextResponse.json(
        { message: "Invalid reminder ID." },
        { status: 400 },
      );
    }

    const body = await request.json();

    if (typeof body.completed !== "boolean") {
      return NextResponse.json(
        { message: "A valid completed status is required." },
        { status: 400 },
      );
    }

    const result = await prisma.reminder.updateMany({
      where: { id: reminderId, userId },
      data: { completed: body.completed },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { message: "Reminder not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Reminder updated successfully.",
    });
  } catch (error) {
    console.error("PATCH reminder error:", error);

    return NextResponse.json(
      { message: "Failed to update reminder." },
      { status: 500 },
    );
  }
}

// DELETE: Delete a reminder
export async function DELETE(request, { params }) {
  try {
    const userId = await getLoggedInUser(request);

    if (!userId) {
      return NextResponse.json({ message: "Please log in." }, { status: 401 });
    }

    const { id } = await params;
    const reminderId = Number(id);

    if (!Number.isInteger(reminderId) || reminderId <= 0) {
      return NextResponse.json(
        { message: "Invalid reminder ID." },
        { status: 400 },
      );
    }

    const result = await prisma.reminder.deleteMany({
      where: { id: reminderId, userId },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { message: "Reminder not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Reminder deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE reminder error:", error);

    return NextResponse.json(
      { message: "Failed to delete reminder." },
      { status: 500 },
    );
  }
}
