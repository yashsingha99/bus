'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

// Define protected routes
const protectedRoutes = [
  '/ticket',
  '/searchBus',
  '/admin',
  // Add more protected routes here
];

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoaded) {
      const isProtectedRoute = protectedRoutes.some(route => 
        pathname.startsWith(route)
      );

      if (isProtectedRoute && !isSignedIn) {
        // Check if we're already on a sign-in or sign-up page
        if (!pathname.startsWith('/sign-in') && !pathname.startsWith('/sign-up')) {
          // Store the current URL in localStorage for after sign-up redirect
          localStorage.setItem('redirectAfterSignUp', pathname);
          router.push(`/sign-up?redirect=${pathname}`);
        }
      }
    }
  }, [isLoaded, isSignedIn, pathname, router]);

  // Show nothing while checking authentication
  if (!isLoaded) {
    return null;
  }

  // For protected routes, only render if signed in
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !isSignedIn) {
    return null;
  }

  // For all other routes, render normally
  return <>{children}</>;
} 