import { NextResponse } from "next/server";
import { dbConnection } from "@/lib/db";
import { UserModel } from "@/model/user.model";

export async function POST(req: Request) {
  try {
    const { email, dob } = await req.json();
    // console.log(email, dob);
    if (!email || !dob) {
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

    // Check if user exists
    const user = await UserModel.findOne({
      $and: [
        { $or: [{ email: email }, { phone: email }] },
        { dob: dob },
      ],
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Check user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
