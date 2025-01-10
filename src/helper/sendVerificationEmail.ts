import {resend} from "../lib/resend"
import verificationEmail from "../../emails/verificationEmail"

import { ApiResponse } from "@/types/ApiResponse"

interface verificationDataProps {
    email: string;
    username: string;
    OTP : number;
}

export async function sendVerificationEmail (verificationData: verificationDataProps) :Promise<ApiResponse> {

     try {

        const {data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: verificationData.email,
            subject: 'Verify your traveller account',
            react: verificationEmail({ username:  verificationData.username, OTP:  verificationData.OTP}),
          });
          
          if(error){
             return {success: false, status: 400, message: "Failed to Sending verification Email"}
          }

        return {success: true, status: 200, message: "Succesfully sent verification code"}
         
     } catch (error) {
        console.log("error");
        return {success: false, status: 500, message: "Internel Issue to sending verification email"}
     }
} 