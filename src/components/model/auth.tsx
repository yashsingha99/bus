"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface SignInFormData {
  email: string;
  dob: string;
}

interface SignUpFormData {
  email: string;
  dob: string;
  fullName: string;
  phone: string;
}

interface SignInErrors {
  email: string;
  dob: string;
}

interface SignUpErrors {
  email: string;
  dob: string;
  fullName: string;
  phone: string;
}

interface dataType {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  userId: string;
}

type AuthProps = {
  children: React.ReactNode;
  navigateRoute: string;
  callback: (() => void)[];
  state: (data: dataType) => void;
};

function Auth({ children, navigateRoute, callback, state }: AuthProps) {
  const handleAllCallbacks = () => {
    callback.forEach((fn) => fn());
  };

  const [signInFormData, setSignInFormData] = useState<SignInFormData>({
    email: "",
    dob: "",
  });

  const [signUpFormData, setSignUpFormData] = useState<SignUpFormData>({
    email: "",
    dob: "",
    fullName: "",
    phone: "",
  });

  const [errorSignIn, setErrorSignIn] = useState<SignInErrors>({
    email: "",
    dob: "",
  });
  const [errorSignUp, setErrorSignUp] = useState<SignUpErrors>({
    phone: "",
    email: "",
    dob: "",
    fullName: "",
  });

  const [isSignIn, setIsSignIn] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleSignInInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignInFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    setErrorSignIn((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSignUpInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignUpFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    setErrorSignUp((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const toggleMode = () => {
    setIsSignIn((prev) => !prev);
    // Clear errors when toggling between sign in and sign up
    setErrorSignIn({ email: "", dob: "" });
    setErrorSignUp({ phone: "", email: "", dob: "", fullName: "" });
  };

  const validateForm = () => {
    let hasErrors = false;
    const newErrorSignIn = { ...errorSignIn };
    const newErrorSignUp = { ...errorSignUp };

    if (isSignIn) {
      if (!signInFormData.email) {
        newErrorSignIn.email = "Email is required";
        hasErrors = true;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signInFormData.email)) {
        newErrorSignIn.email = "Invalid email format";
        hasErrors = true;
      }

      if (!signInFormData.dob) {
        newErrorSignIn.dob = "Date of Birth is required";
        hasErrors = true;
      } else if (
        !/^(0[1-9]|[12][0-9]|3[01])(0[1-9]|1[0-2])\d{4}$/.test(
          signInFormData.dob
        )
      ) {
        newErrorSignIn.dob = "Invalid DOB format. Use DDMMYYYY";
        hasErrors = true;
      }
    } else {
      if (!signUpFormData.email) {
        newErrorSignUp.email = "Email is required";
        hasErrors = true;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signUpFormData.email)) {
        newErrorSignUp.email = "Invalid email format";
        hasErrors = true;
      }

      if (!signUpFormData.dob) {
        newErrorSignUp.dob = "Date of Birth is required";
        hasErrors = true;
      } else if (
        !/^(0[1-9]|[12][0-9]|3[01])(0[1-9]|1[0-2])\d{4}$/.test(
          signUpFormData.dob
        )
      ) {
        newErrorSignUp.dob = "Invalid DOB format. Use DDMMYYYY";
        hasErrors = true;
      }

      if (!signUpFormData.fullName) {
        newErrorSignUp.fullName = "Full name is required for registration";
        hasErrors = true;
      }

      if (!signUpFormData.phone) {
        newErrorSignUp.phone = "Phone number is required for registration";
        hasErrors = true;
      } else if (!/^\+?[1-9]\d{9,11}$/.test(signUpFormData.phone)) {
        newErrorSignUp.phone = "Invalid phone number";
        hasErrors = true;
      }
    }

    setErrorSignIn(newErrorSignIn);
    setErrorSignUp(newErrorSignUp);

    return !hasErrors;
  };

  const handleSubmit = async () => {
    try {
      if (!validateForm()) {
        return;
      }

      setIsLoading(true);
      const endpoint = isSignIn ? "/api/auth/check" : "/api/auth";

      const payload = isSignIn
        ? {
            email: signInFormData.email,
            dob: signInFormData.dob,
          }
        : {
            email: signUpFormData.email,
            dob: signUpFormData.dob,
            fullName: signUpFormData.fullName,
            phone: signUpFormData.phone,
          };

      const response = await axios.post(endpoint, payload);
      console.log(response.data);

      if (response.data) {
        if (state) {
          state(response.data.exists);
        }
        console.log(response.data)
        const userD = {
          email: response.data.user.email,
          fullName: response.data.user.fullname,
          phone: response.data.user.phone,
          role: response.data.user.role,
          id: response.data.user._id,
        };
        localStorage.setItem("user", JSON.stringify(userD));
        toast.success(
          isSignIn ? "Signed in successfully!" : "Registered successfully!"
        );
        setIsOpen(false);
        if (navigateRoute === "") {
          handleAllCallbacks();
        } else {
          router.push(navigateRoute);
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(isSignIn  ? "Email With DOB does not Exist!" : "User Aready Exist With this Email or Phone Number!");
      } else {
        console.error("Unknown error", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isSignIn ? "Sign In" : "Register"}</DialogTitle>
          <DialogDescription>
            {isSignIn
              ? "Sign in with your email and date of birth"
              : "Create a new account"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {!isSignIn && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="John Doe"
                  value={signUpFormData.fullName}
                  onChange={handleSignUpInputChange}
                />
                {errorSignUp.fullName && (
                  <p className="text-red-500 text-sm">{errorSignUp.fullName}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+919876543210"
                  value={signUpFormData.phone}
                  onChange={handleSignUpInputChange}
                />
                {errorSignUp.phone && (
                  <p className="text-red-500 text-sm">{errorSignUp.phone}</p>
                )}
              </div>
            </>
          )}

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="example@example.com"
              value={isSignIn ? signInFormData.email : signUpFormData.email}
              onChange={
                isSignIn ? handleSignInInputChange : handleSignUpInputChange
              }
            />
            {isSignIn
              ? errorSignIn.email && (
                  <p className="text-red-500 text-sm">{errorSignIn.email}</p>
                )
              : errorSignUp.email && (
                  <p className="text-red-500 text-sm">{errorSignUp.email}</p>
                )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="dob">Date of Birth (Use as Password) </Label>
            <Input
              id="dob"
              name="dob"
              placeholder="DDMMYYYY"
              maxLength={8}
              value={isSignIn ? signInFormData.dob : signUpFormData.dob}
              onChange={
                isSignIn ? handleSignInInputChange : handleSignUpInputChange
              }
            />
            {isSignIn
              ? errorSignIn.dob && (
                  <p className="text-red-500 text-sm">{errorSignIn.dob}</p>
                )
              : errorSignUp.dob && (
                  <p className="text-red-500 text-sm">{errorSignUp.dob}</p>
                )}
            <span className="text-xs text-gray-500">
              Format: DDMMYYYY (e.g., 27052000)
            </span>
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-2">
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Processing..." : isSignIn ? "Sign In" : "Register"}
          </Button>
          <Button
            variant="outline"
            onClick={toggleMode}
            disabled={isLoading}
            className="w-full"
          >
            {isSignIn
              ? "Don't have an account? Register"
              : "Already have an account? Sign In"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default Auth;
