"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SignUp, useUser } from "@clerk/nextjs";
import { createUser } from "@/API/user.api";
import { useEffect } from "react";

export default function CustomSignUp() {
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || '/';
   const router = useRouter();
  const { user, isLoaded } = useUser();
  console.log(user)
  useEffect(() => {
    if (isLoaded && user) {
      // Store user data in MongoDB
      fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: user.fullName,
          email: user.emailAddresses[0].emailAddress,
          phoneNumber: user.phoneNumbers[0]?.phoneNumber || '',
          clerkId: user.id,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.token) {
            localStorage.setItem('token', data.token);
            router.push(redirectPath);
          }
        })
        .catch((error) => {
          console.error('Error storing user data:', error);
        });
    }
  }, []);

  // afterSignUpUrl={redirectPath} 
  //       redirectUrl={redirectPath}
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <SignUp 
        
      />
    </div>
  );
} 