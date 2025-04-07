"use client";

import { useSearchParams } from "next/navigation";
import { SignIn } from "@clerk/nextjs";

export default function CustomSignIn() {
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || '/';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <SignIn afterSignInUrl={redirectPath} redirectUrl={redirectPath} />
    </div>
  );
}
