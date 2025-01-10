import { resend } from "../lib/resend";
import verificationEmail from "../../emails/verificationEmail";

import { ApiResponse } from "@/types/ApiResponse";

interface VerificationDataProps {
  email: string;
  username: string;
  OTP: number;
  OTPExpiry: Date;
}

export async function sendVerificationEmail(
  verificationData: VerificationDataProps
): Promise<ApiResponse> {
  try {

    // *******************CHECK IF THE OTP HAS EXPIRED ******************** //

    if (new Date(verificationData.OTPExpiry).getTime() < Date.now()) {
      return { success: false, status: 403, message: "OTP has expired" };
    }


    //**************************** SEND THE VERIFICATION EMAIL *******************//
    
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: verificationData.email,
      subject: "Verify your Traveller account",
      react: verificationEmail({
        username: verificationData.username,
        OTP: verificationData.OTP,
      }),
    });

    //**************************** AN ERROR DURING THE SENDING EMAIL *******************//

    if (error) {
      return {
        success: false,
        status: 400,
        message: "Failed to send the verification email",
      };
    }

    //**************************** SUCCESFULLY  SENDING THE VERIFICATION EMAIL *******************//

    return {
      success: true,
      status: 200,
      message: "Successfully sent the verification code",
    };

  } catch (error) {

    //**************************** AN INTERNEL ERROR DURING THE SENDING THE VERIFICATION EMAIL *******************//

    console.error("Error sending verification email:", error);
    return {
      success: false,
      status: 500,
      message: "Internal issue while sending the verification email",
    };
  }
}
