import { sendVerificationEmail } from "@/helper/sendVerificationEmail";
import { dbConnection } from "@/lib/db";
import { UserModel } from "../../../../model/user.model";
import { nullable } from "zod";

export async function POST(request: Request) {
  await dbConnection();

  try {
    const { email, username, password, phoneNumber } = await request.json();
    const user = await UserModel.findOne({ email });
    if (user && user.isVerified) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "A verified user with this email already exists",
        }),
        { status: 409 } // Conflict
      );
    }

    const OTP = Math.floor(1000 + Math.random() * 9000); // Generate a 4-digit OTP
    const OTPExpiry = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes

    if (user) {
      user.OTP = OTP;
      user.OTPExpiry = OTPExpiry;
      await user.save();
    } else {
      await UserModel.create({
        username,
        email,
        phoneNumber,
        password, //TODO: Consider hashing this password for security
        OTP,
        OTPExpiry,
      });
    }

    const emailResponse = await sendVerificationEmail({
      email,
      username,
      OTP,
      OTPExpiry,
    });
    if (!emailResponse.success) {
      return new Response(
        JSON.stringify({
          success: false,
          message: emailResponse.message,
        }),
        { status: emailResponse.status } // Internal Server Error for email failure
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message:
          "User registered successfully. Please check your email for verification.",
      }),
      { status: 201 } // Created
    );
  } catch (error) {
    console.error("Error during user registration:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: "An unexpected error occurred. Please try again later.",
      }),
      { status: 500 } // Internal Server Error
    );
  }
}

// ****************** Get All Users ****************** //

export async function GET(request: Request) {
  await dbConnection();

  // const { searchParams } = new URL(request.url);
  // const role = searchParams.get("role");
  // const isVerified = searchParams.get("isVerified");

  try {
    // const query: Record<string, any> = {};
    // if (role) query.role = role;
    // if (isVerified !== null) query.isVerified = isVerified === "true";

    const users = await UserModel.find({
      $and: [
        { $or: [{ role: "USER" }, { role: "COORDINATE" }] },
        { isVerified: true },
      ],
    }).select("-password -OTP -OTPExpiry");

    return new Response(
      JSON.stringify({
        success: true,
        users,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error handling GET request:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "An unexpected error occurred. Please try again later.",
      }),
      { status: 500 }
    );
  }
}

// ****************** Update User (Update User Details) ****************** //
export async function PUT(request: Request) {
  await dbConnection();

  try {
    const { email, ...updates } = await request.json();

    if (!email) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Email is required.",
        }),
        { status: 400 } // Bad Request
      );
    }

    const user = await UserModel.findOneAndUpdate({ email }, updates, {
      new: true,
    });

    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User not found.",
        }),
        { status: 404 } // Not Found
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "User updated successfully.",
        user,
      }),
      { status: 200 } // OK
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "An unexpected error occurred. Please try again later.",
      }),
      { status: 500 } // Internal Server Error
    );
  }
}

// ****************** Delete User ****************** //
export async function DELETE(request: Request) {
  await dbConnection();

  try {
    const { email } = await request.json();

    if (!email) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Email is required.",
        }),
        { status: 400 } // Bad Request
      );
    }

    const user = await UserModel.findOneAndDelete({ email });

    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User not found.",
        }),
        { status: 404 } // Not Found
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "User deleted successfully.",
      }),
      { status: 200 } // OK
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "An unexpected error occurred. Please try again later.",
      }),
      { status: 500 } // Internal Server Error
    );
  }
}
