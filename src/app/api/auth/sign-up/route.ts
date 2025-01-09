import { sendVerificationEmail } from "@/helper/sendVerificationEmail";
import { dbConnection } from "@/lib/db";
import { UserModel } from "../../../../model/user.model";
// import bcrypt from "bcrypt"

export async function POST(request: Request) {

  await dbConnection();

  try {
    let { email, username, password, phoneNumber } = await request.json();
  //  console.log(email);
   
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
      // password = await bcrypt.hash(password, 10)
      const newUser = await UserModel.create({
        username,
        email,
        phoneNumber,
        password,
        OTP,
        OTPExpiry,
      });
    }

    const emailResponse =  await sendVerificationEmail({ email, username, OTP });

    if(!emailResponse.success){
       return Response.json({
          sucess: false,
          message: "User name is already taken"
       }, {status: 400});
    }

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
