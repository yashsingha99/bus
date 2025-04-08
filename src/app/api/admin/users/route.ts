import { dbConnection } from "@/lib/db";
import { UserModel } from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";

// Get all users with pagination
export async function GET(request: NextRequest) {
  await dbConnection();
  
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";
    
    const skip = (page - 1) * limit;
    
    // Build query
    const query: any = {};
    
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phoneNumber: { $regex: search, $options: "i" } }
      ];
    }
    
    if (role) {
      query.role = role;
    }
    
    // Get users with pagination
    const users = await UserModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const total = await UserModel.countDocuments(query);
    
    return NextResponse.json({
      success: true,
      data: {
        users,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch users", error: error.message },
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
    const requiredFields = ["fullName", "email", "phoneNumber", "clerkId", "role"];
    const missingFields = requiredFields.filter(field => !userData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, message: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await UserModel.findOne({ 
      $or: [
        { email: userData.email },
        { phoneNumber: userData.phoneNumber },
        { clerkId: userData.clerkId }
      ]
    });
    
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 400 }
      );
    }
    
    // Create new user
    const newUser = await UserModel.create(userData);
    
    return NextResponse.json({
      success: true,
      message: "User created successfully",
      data: newUser
    }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create user", error: error.message },
      { status: 500 }
    );
  }
} 