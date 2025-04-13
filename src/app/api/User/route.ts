import { dbConnection } from "@/lib/db";
import { UserModel } from "../../../model/user.model";

// ****************** Get All Users ****************** //

export async function GET() {
    await dbConnection();
  
    try {

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
  