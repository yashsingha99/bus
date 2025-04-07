"use client";

import { useSearchParams } from "next/navigation";
import { SignUp } from "@clerk/nextjs";

export default function CustomSignUp() {
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || '/';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <SignUp 
        afterSignUpUrl={redirectPath} 
        redirectUrl={redirectPath}
      />
    </div>
  );
} 