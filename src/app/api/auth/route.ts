import { NextResponse } from "next/server";
import { dbConnection } from "@/lib/db";
import { UserModel } from "@/model/user.model";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { fullName, email, phoneNumber, clerkId } = await req.json();

    if (!email || !fullName || !clerkId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    try {
      await dbConnection();
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    try {
      const existingUser = await UserModel.findOne({ clerkId });
      if (existingUser) {
        return NextResponse.json({
          user: {
            id: existingUser._id,
            fullName: existingUser.fullName,
            email: existingUser.email,
            phoneNumber: existingUser.phoneNumber,
            role: existingUser.role
          }
        });
      }

      const newUser = await UserModel.create({
        fullName,
        email,
        phoneNumber: phoneNumber || "",
        clerkId,
        role: "USER",
        notifications: [],
      });

      return NextResponse.json({
        user: {
          id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          phoneNumber: newUser.phoneNumber,
          role: newUser.role
        }
      });
    } catch (modelError) {
      console.error("Model operation error:", modelError);
      return NextResponse.json(
        { error: "Database operation failed" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
