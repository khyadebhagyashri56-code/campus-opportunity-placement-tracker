import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim();
    const location = searchParams.get("location")?.trim();
    const jobType = searchParams.get("jobType")?.trim();

    const where = {};

    // Search by job title, description, or company name
    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          company: {
            is: {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        },
      ];
    }

    // Filter by location
    if (location) {
      where.location = {
        contains: location,
        mode: "insensitive",
      };
    }

    // Filter by job type
    if (jobType) {
      where.jobType = {
        equals: jobType,
        mode: "insensitive",
      };
    }

    const opportunities = await prisma.opportunity.findMany({
      where,
      include: {
        company: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      totalOpportunities: opportunities.length,
      opportunities,
    });
  } catch (error) {
    console.error("Error fetching opportunities:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch opportunities.",
      },
      { status: 500 },
    );
  }
}
