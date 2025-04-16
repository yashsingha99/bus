import { NextResponse } from "next/server";
import { dbConnection } from "@/lib/db";
import { UserModel } from "@/model/user.model";

export async function POST(req: Request) {
  try {
    const { phone, fullName, dob, email } = await req.json();
    
    console.log(phone, fullName, dob, email);
    if (!phone || !fullName || !dob || !email) {
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
      const existingUser = await UserModel.findOne(
        { $or: [{ phone: phone }, { email: email }] }
      );
      if (existingUser) {
        return NextResponse.json(
          { error: "User already exists" },
          { status: 400 }
        );
      }

      const newUser = await UserModel.create({
        fullName: fullName,
        phone: phone || "",
        email: email || "",
        dob: dob,
        role: "USER",
        notifications: [],
      });
      console.log(newUser);
      
      return NextResponse.json({
         user :  newUser
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
