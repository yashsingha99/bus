import { dbConnection } from "@/lib/db";
import { UserModel } from "../../../../model/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  await dbConnection();
  const { userId } = params;
  try {
    const user = await UserModel.findById(userId);
        if (!user) {
      return NextResponse.json({ message: "User Not Found", status: 400 });
    }

    return NextResponse.json({ user, message: "user found" });
  } catch (error) {
    
    console.log("HERE", error);
  }
}
