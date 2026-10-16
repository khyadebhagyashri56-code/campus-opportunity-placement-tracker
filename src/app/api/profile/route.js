import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import prisma from "@/lib/prisma";

async function getLoggedInUserId(request) {
  const token = request.cookies.get("auth_token")?.value;
  const secret = process.env.JWT_SECRET;

  if (!token || !secret) return null;

  try {
    const secretKey = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, secretKey);
    const userId = Number(payload.sub);

    if (!Number.isSafeInteger(userId) || userId <= 0) {
      return null;
    }

    return userId;
  } catch {
    return null;
  }
}

const profileSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  college: true,
  course: true,
  graduationYear: true,
  skills: true,
  profilePhoto: true,
  resumeName: true,
};

// GET: Load profile
export async function GET(request) {
  try {
    const userId = await getLoggedInUserId(request);

    if (!userId) {
      return NextResponse.json(
        { message: "Please log in first." },
        { status: 401 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: profileSelect,
    });

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Load profile error:", error);

    return NextResponse.json(
      { message: "Unable to load profile." },
      { status: 500 },
    );
  }
}

// PUT: Save profile, photo and resume
export async function PUT(request) {
  try {
    const userId = await getLoggedInUserId(request);

    if (!userId) {
      return NextResponse.json(
        { message: "Please log in first." },
        { status: 401 },
      );
    }

    const formData = await request.formData();

    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const college = String(formData.get("college") || "").trim();
    const course = String(formData.get("course") || "").trim();
    const skills = String(formData.get("skills") || "").trim();
    const yearValue = String(formData.get("graduationYear") || "").trim();

    if (!name) {
      return NextResponse.json(
        { message: "Full name is required." },
        { status: 400 },
      );
    }

    let graduationYear = null;

    if (yearValue) {
      graduationYear = Number(yearValue);

      if (
        !Number.isInteger(graduationYear) ||
        graduationYear < 2000 ||
        graduationYear > 2100
      ) {
        return NextResponse.json(
          { message: "Enter a valid graduation year." },
          { status: 400 },
        );
      }
    }

    const updateData = {
      name,
      phone: phone || null,
      college: college || null,
      course: course || null,
      skills: skills || null,
      graduationYear,
    };

    const photo = formData.get("photo");

    if (photo && typeof photo.arrayBuffer === "function") {
      const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

      if (!allowedImageTypes.includes(photo.type)) {
        return NextResponse.json(
          { message: "Use a JPG, PNG or WebP photo." },
          { status: 400 },
        );
      }

      if (photo.size === 0 || photo.size > 2 * 1024 * 1024) {
        return NextResponse.json(
          { message: "Photo must be larger than 0 and at most 2 MB." },
          { status: 400 },
        );
      }

      const bytes = Buffer.from(await photo.arrayBuffer());

      updateData.profilePhoto = `data:${photo.type};base64,${bytes.toString("base64")}`;
    }

    const resume = formData.get("resume");

    if (resume && typeof resume.arrayBuffer === "function") {
      if (
        resume.type !== "application/pdf" ||
        !resume.name.toLowerCase().endsWith(".pdf")
      ) {
        return NextResponse.json(
          { message: "Please upload a PDF resume." },
          { status: 400 },
        );
      }

      if (resume.size === 0 || resume.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { message: "Resume must be larger than 0 and at most 5 MB." },
          { status: 400 },
        );
      }

      const bytes = Buffer.from(await resume.arrayBuffer());

      if (bytes.subarray(0, 5).toString() !== "%PDF-") {
        return NextResponse.json(
          { message: "The uploaded file is not a valid PDF." },
          { status: 400 },
        );
      }

      updateData.resumeName = resume.name;
      updateData.resumeData = `data:application/pdf;base64,${bytes.toString("base64")}`;
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: profileSelect,
    });

    return NextResponse.json({
      message: "Profile saved successfully.",
      user,
    });
  } catch (error) {
    console.error("Save profile error:", error);

    return NextResponse.json(
      { message: "Unable to save profile." },
      { status: 500 },
    );
  }
}

// DELETE: Remove only the profile photo
export async function DELETE(request) {
  try {
    const userId = await getLoggedInUserId(request);

    if (!userId) {
      return NextResponse.json(
        { message: "Please log in first." },
        { status: 401 },
      );
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { profilePhoto: null },
      select: profileSelect,
    });

    return NextResponse.json({
      message: "Profile photo removed successfully.",
      user,
    });
  } catch (error) {
    console.error("Remove profile photo error:", error);

    return NextResponse.json(
      { message: "Unable to remove profile photo." },
      { status: 500 },
    );
  }
}
