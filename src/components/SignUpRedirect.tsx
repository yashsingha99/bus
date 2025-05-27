'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SignUpRedirect() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      // Get the stored redirect URL
      const redirectUrl = localStorage.getItem('redirectAfterSignUp');
      
      if (redirectUrl) {
        // Clear the stored URL
        localStorage.removeItem('redirectAfterSignUp');
        
        // Redirect to the stored URL
        router.push(redirectUrl);
      }
    }
  }, [isLoaded, isSignedIn, router]);

  return null;
} 