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

    if (!Number.isSafeInteger(userId) || userId <= 0) {
      return null;
    }

    return await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
  } catch {
    return null;
  }
}

// GET: Fetch logged-in user's applications
export async function GET(request) {
  try {
    const user = await getLoggedInUser(request);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Please log in first." },
        { status: 401 },
      );
    }

    const applications = await prisma.application.findMany({
      where: { userId: user.id },
      include: {
        opportunity: {
          include: {
            company: true,
          },
        },
      },
      orderBy: { appliedAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error("Fetch applications error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to load applications." },
      { status: 500 },
    );
  }
}

// POST: Add an opportunity to the application tracker
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
        { success: false, message: "Invalid opportunity ID." },
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

    const application = await prisma.application.upsert({
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
        status: "APPLIED",
      },
      include: {
        opportunity: {
          include: {
            company: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Application added to tracker.",
      application,
    });
  } catch (error) {
    console.error("Create application error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to add application." },
      { status: 500 },
    );
  }
}

// PATCH: Update an application's status
export async function PATCH(request) {
  try {
    const user = await getLoggedInUser(request);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Please log in first." },
        { status: 401 },
      );
    }

    const body = await request.json();
    const applicationId = Number(body.applicationId);
    const status = body.status;

    const allowedStatuses = [
      "APPLIED",
      "TEST",
      "INTERVIEW",
      "SELECTED",
      "REJECTED",
    ];

    if (
      !Number.isSafeInteger(applicationId) ||
      applicationId <= 0 ||
      !allowedStatuses.includes(status)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid application ID or status." },
        { status: 400 },
      );
    }

    const existingApplication = await prisma.application.findFirst({
      where: {
        id: applicationId,
        userId: user.id,
      },
      select: { id: true },
    });

    if (!existingApplication) {
      return NextResponse.json(
        { success: false, message: "Application not found." },
        { status: 404 },
      );
    }

    const application = await prisma.application.update({
      where: { id: applicationId },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      message: "Application status updated successfully.",
      application,
    });
  } catch (error) {
    console.error("Update application status error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to update application status." },
      { status: 500 },
    );
  }
}
