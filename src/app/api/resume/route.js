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

// Fetch the logged-in user's saved resume
export async function GET(request) {
  try {
    const userId = await getLoggedInUser(request);

    if (!userId) {
      return NextResponse.json(
        { message: "Please log in first." },
        { status: 401 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        resumeName: true,
        resumeData: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    return NextResponse.json({
      resumeName: user.resumeName,
      resumeData: user.resumeData ? JSON.parse(user.resumeData) : null,
    });
  } catch (error) {
    console.error("Fetch resume error:", error);

    return NextResponse.json(
      { message: "Could not fetch resume." },
      { status: 500 },
    );
  }
}

// Save the logged-in user's resume
export async function PUT(request) {
  try {
    const userId = await getLoggedInUser(request);

    if (!userId) {
      return NextResponse.json(
        { message: "Please log in first." },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { resumeName, resumeData } = body;

    if (
      typeof resumeName !== "string" ||
      !resumeName.trim() ||
      !resumeData ||
      typeof resumeData !== "object" ||
      Array.isArray(resumeData)
    ) {
      return NextResponse.json(
        { message: "Valid resume name and data are required." },
        { status: 400 },
      );
    }

    const serializedData = JSON.stringify(resumeData);

    if (serializedData.length > 500_000) {
      return NextResponse.json(
        { message: "Resume data is too large." },
        { status: 413 },
      );
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        resumeName: resumeName.trim(),
        resumeData: serializedData,
      },
      select: {
        resumeName: true,
      },
    });

    return NextResponse.json({
      message: "Resume saved successfully.",
      resumeName: user.resumeName,
    });
  } catch (error) {
    console.error("Save resume error:", error);

    return NextResponse.json(
      { message: "Could not save resume." },
      { status: 500 },
    );
  }
}
