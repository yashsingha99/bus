import { z } from "zod";

//------------------------------------------------------------------------------------------------//
// signIn Validation

export const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string()
});




//------------------------------------------------------------------------------------------------//
// signup Validation

export const signUpSchema = z.object({
    name: z.string({message: "name must be contains only alphabets"}),
    email: z.string({message: "email should be string"}).email({message: "Invalid email address"}),
    password: z
    .string()
    .min(4, { message: "Password must  be atleast 6 character" })
    .max(10, { message: "Password must  be atmost 10 character" })
})

//------------------------------------------------------------------------------------------------//
// OTP Validation

export const OTPSchema = z.object({
    code: z.string()
    .length(4, {message: "Verification code must be 4 digits"})
})

