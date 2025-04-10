"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";

const protectedRoutes = [
  { pattern: /^\/ticket(\/.*)?$/, base: "/ticket" },
  { pattern: /^\/searchBus\/source(\/.*)?$/, base: "/searchBus/source" },
  { pattern: /^\/admin(\/.*)?$/, base: "/admin" },
];

export default function RouteGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSignedIn, isLoaded, user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const userRole = JSON.parse(localStorage.getItem("user") || "{}").role;
  const isProtectedRoute = useMemo(() => {
    return protectedRoutes.some((route) => route.pattern.test(pathname));
  }, [pathname]);

  // Store user data in backend and localStorage
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const userData = {
        fullName: user.fullName,
        email: user.primaryEmailAddress?.emailAddress,
        phoneNumber: user.primaryPhoneNumber?.phoneNumber || "",
        clerkId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        role: "USER",
        notifications: [],
      };

      fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            localStorage.setItem("user", JSON.stringify(data.user));

            const returnUrl = sessionStorage.getItem('returnUrl');
            if (returnUrl) {
              sessionStorage.removeItem('returnUrl');
              router.push(returnUrl);
            } 
            // else {
            //   router.push('/');
            // }
          }
        })
        .catch((error) => {
          console.error("Error storing user data:", error);
        });
    }
  }, [isLoaded, isSignedIn, user, router]);

  useEffect(() => {
    if (isLoaded && isProtectedRoute && !isSignedIn) {
      if (
        !pathname.startsWith("/sign-in") &&
        !pathname.startsWith("/sign-up")
      ) {
        let queryParams = "";
        searchParams.forEach((value, key) => {
          queryParams += `${key}=${value}&`;
        });

        let newRedirectURL = `${pathname}?${queryParams}`;

        // localStorage.setItem('redirectAfterSignUp', JSON.stringify({
        //   path: newRedirect,
        //   query: queryParams,
        // }));
        localStorage.setItem("redirectAfterSignUp", newRedirectURL);

        const currentPath = window.location.pathname + window.location.search;
        sessionStorage.setItem('returnUrl', currentPath);
        router.push(`/sign-in?redirect=true`);
      }
    }
  }, [isLoaded, isSignedIn, pathname, searchParams, isProtectedRoute, router]);

  if (!isLoaded || (isProtectedRoute && !isSignedIn)) {
    return null;
  }

  return <>{children}</>;
}
