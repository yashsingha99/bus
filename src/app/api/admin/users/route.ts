import { dbConnection } from "@/lib/db";
import { UserModel } from "@/model/user.model";
import { NextResponse } from "next/server";

// interface QueryParams {
//   page?: string;
//   limit?: string;
//   role?: string;
//   search?: string;
// }

// Get all users with pagination
export async function GET(request: Request) {
  try {
    await dbConnection();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const role = searchParams.get("role");
    const search = searchParams.get("search");

    const query: Record<string, unknown> = {};

    if (role) {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phoneNumber: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const users = await UserModel.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .select("-password");

    const totalUsers = await UserModel.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        total: totalUsers,
        page,
        limit,
        totalPages: Math.ceil(totalUsers / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// Create a new user
export async function POST(request: Request) {
  await dbConnection();

  try {
    const userData = await request.json();

    // Validate required fields
    const requiredFields = [
      "fullName",
      "email",
      "phoneNumber",
      "clerkId",
      "role",
    ];
    const missingFields = requiredFields.filter((field) => !userData[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Missing required fields: ${missingFields.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({
      $or: [
        { email: userData.email },
        { phoneNumber: userData.phoneNumber },
        { clerkId: userData.clerkId },
      ],
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 400 }
      );
    }

    // Create new user
    const newUser = await UserModel.create(userData);

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        data: newUser,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to create user",
          error: error.message,
        },
        { status: 500 }
      );
    } else {
      console.error("Unknown error", error);
    }
  }
}

export async function PATCH(request: Request) {
  await dbConnection();

  try {
    const { userId, role } = await request.json();

    if (!userId || !role) {
      return NextResponse.json(
        { success: false, message: "User ID and role are required" },
        { status: 400 }
      );
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User role updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update user" },
      { status: 500 }
    );
  }
}
