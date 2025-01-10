import { sendVerificationEmail } from "@/helper/sendVerificationEmail";
import { dbConnection } from "@/lib/db";
import { UserModel } from "../../../../model/user.model";

export async function POST(request: Request) { 
  await dbConnection();

  try {
    const { email, username, password, phoneNumber } = await request.json();

    const user = await UserModel.findOne({ email });

    if (user && user.isVerified) {


      // *********************** User is already verified and exists ************************* //

      return new Response(
        JSON.stringify({
          success: false,
          message: "A verified user with this email already exists",
        }),
        { status: 409 } // Conflict
      );

    }


    // ************************* OTP Creation and validation [ Define ] ************** //

    const OTP = Math.floor(1000 + Math.random() * 9000); // Generate a 4-digit OTP
    const OTPExpiry = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes


    if (user) {


      // ********** User exists but is not verified ********** //

      user.OTP = OTP;
      user.OTPExpiry = OTPExpiry;
      await user.save();


    } else {


      // ********** New user registration ********** //

      await UserModel.create({
        username,
        email,
        phoneNumber,
        password, //TODO: Consider hashing this password for security
        OTP,
        OTPExpiry,
      });


    }

    const emailResponse = await sendVerificationEmail({ email, username, OTP, OTPExpiry });

    if ( !emailResponse.success ) {


      // ********** Failed to send verification email ********** //

      return new Response(
        JSON.stringify({
          success: false,
          message: emailResponse.message,
        }),
        { status: emailResponse.status } // Internal Server Error for email failure
      );

    }


    // ********** User registration successful ********** //

    return new Response(
      JSON.stringify({
        success: true,
        message: "User registered successfully. Please check your email for verification.",
      }),
      { status: 201 } // Created
    );


  } catch (error) {
    console.error("Error during user registration:", error);



    // ********** Internal server error during registration ********** //

    return new Response(
      JSON.stringify({
        success: false,
        message: "An unexpected error occurred. Please try again later.",
      }),
      { status: 500 } // Internal Server Error
    );


  }
}
