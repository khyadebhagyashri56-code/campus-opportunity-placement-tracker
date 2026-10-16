import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import prisma from "@/lib/prisma";

async function getLoggedInUser(request) {
  const token = request.cookies.get("auth_token")?.value;

  if (!token) {
    return null;
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured.");
  }

  const secretKey = new TextEncoder().encode(secret);
  const { payload } = await jwtVerify(token, secretKey);
  const userId = Number(payload.sub);

  if (!Number.isSafeInteger(userId) || userId <= 0) {
    return null;
  }

  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });
}

// GET: Fetch saved opportunities for the logged-in user
export async function GET(request) {
  try {
    const user = await getLoggedInUser(request);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Please log in first." },
        { status: 401 },
      );
    }

    const savedOpportunities = await prisma.savedOpportunity.findMany({
      where: { userId: user.id },
      include: {
        opportunity: {
          include: { company: true },
        },
      },
      orderBy: { savedAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      savedOpportunities,
    });
  } catch (error) {
    console.error("Fetch saved opportunities error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch saved opportunities." },
      { status: 500 },
    );
  }
}

// POST: Save an opportunity
export async function POST(request) {
  try {
    const user = await getLoggedInUser(request);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Please log in first." },
        { status: 401 },
      );
    }

    const body = await request.json();
    const opportunityId = Number(body.opportunityId);

    if (!Number.isSafeInteger(opportunityId) || opportunityId <= 0) {
      return NextResponse.json(
        { success: false, message: "A valid opportunity ID is required." },
        { status: 400 },
      );
    }

    const opportunity = await prisma.opportunity.findUnique({
      where: { id: opportunityId },
      select: { id: true },
    });

    if (!opportunity) {
      return NextResponse.json(
        { success: false, message: "Opportunity not found." },
        { status: 404 },
      );
    }

    const savedOpportunity = await prisma.savedOpportunity.upsert({
      where: {
        userId_opportunityId: {
          userId: user.id,
          opportunityId,
        },
      },
      update: {},
      create: {
        userId: user.id,
        opportunityId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Opportunity saved successfully.",
      savedOpportunity,
    });
  } catch (error) {
    console.error("Save opportunity error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to save opportunity." },
      { status: 500 },
    );
  }
}

export async function DELETE(request) {
  try {
    const user = await getLoggedInUser(request);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Please log in first." },
        { status: 401 },
      );
    }

    const body = await request.json();
    const opportunityId = Number(body.opportunityId);

    if (!Number.isSafeInteger(opportunityId) || opportunityId <= 0) {
      return NextResponse.json(
        { success: false, message: "A valid opportunity ID is required." },
        { status: 400 },
      );
    }

    const result = await prisma.savedOpportunity.deleteMany({
      where: {
        userId: user.id,
        opportunityId,
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { success: false, message: "Saved opportunity not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Opportunity removed from saved jobs.",
    });
  } catch (error) {
    console.error("Remove saved opportunity error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to remove saved opportunity." },
      { status: 500 },
    );
  }
}
