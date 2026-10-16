import { prisma } from "@/app/lib/prisma";

export async function POST(request) {
  try {
    const body = await request.json();

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: body.password,
      },
    });

    return Response.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        error: "User creation failed",
      },
      { status: 500 }
    );
  }
}