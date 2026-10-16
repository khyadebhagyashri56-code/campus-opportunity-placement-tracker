import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const opportunityId = Number(id);

    if (!Number.isInteger(opportunityId) || opportunityId <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid opportunity ID." },
        { status: 400 },
      );
    }

    const opportunity = await prisma.opportunity.findUnique({
      where: { id: opportunityId },
      include: { company: true },
    });

    if (!opportunity) {
      return NextResponse.json(
        { success: false, message: "Opportunity not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      opportunity,
    });
  } catch (error) {
    console.error("Error fetching opportunity:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch opportunity." },
      { status: 500 },
    );
  }
}
