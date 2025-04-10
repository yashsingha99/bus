"use client";

import { redirect, useRouter, useSearchParams } from "next/navigation";
import { SignIn, useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { createUser } from "@/API/user.api";

export default function CustomSignIn() {
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";
  const router = useRouter();
  const { user, isLoaded } = useUser();

  // useEffect(() => {
  //   if (isLoaded && user) {
  //     fetch("/api/auth", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         fullName: user.fullName,
  //         email: user.emailAddresses[0].emailAddress,
  //         phoneNumber: user.phoneNumbers[0]?.phoneNumber || "",
  //         clerkId: user.id,
  //       }),
  //     })
  //       .then((res) => res.json())
  //       .then((data) => {
  //         if (data.token) {
  //           localStorage.setItem("token", data.token);
  //           router.push("/");
  //         }
  //       })
  //       .catch((error) => {
  //         console.error("Error storing user data:", error);
  //       });
  //   }
  // }, [isLoaded, user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <SignIn  />
    </div>
  );
}
