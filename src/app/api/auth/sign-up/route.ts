import { sendVerificationEmail } from "@/helper/sendVerificationEmail";
import { dbConnection } from "@/lib/db";
import { UserModel } from "../../../../model/user.model";
export async function POST(request: Request) {
  await dbConnection();

  try {
    const { email, username, password, phoneNumber } = await request.json();

    const user = await UserModel.findOne({ email });

    if (user && user.isVerified) {
      return Response.json(
        {
          success: false,
          message: "User with this email already exist",
        },
        {
          status: 400,
        }
      );
    }
    const OTP = Math.floor(1000 + Math.random() * 9000);
    const OTPExpiry = new Date(Date.now() + 5 * 60 * 1000);
    if (user) {
      user.OTP = OTP;
      user.OTPExpiry = OTPExpiry;
      await user.save();
    } else {
      const newUser = await UserModel.create({
        username,
        email,
        phoneNumber,
        password,
        OTP,
        OTPExpiry,
      });
    }

    sendVerificationEmail({ email, username, OTP });
    // VerifyOTP()
    Response.json(
      {
        sucess: false,
        message: "Successfully register User",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error registering user", error);
    Response.json(
      {
        sucess: false,
        message: "Error registering user",
      },
      {
        status: 500,
      }
    );
  }
}
