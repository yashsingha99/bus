"use client";

// import { useUser } from "@clerk/nextjs";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";

const protectedRoutes = [
  { pattern: /^\/ticket(\/.*)?$/, base: "/ticket" },
  // { pattern: /^\/searchBus\/source(\/.*)?$/, base: "/searchBus/source" },
  // { pattern: /^\/admin(\/.*)?$/, base: "/admin" },
];

export default function RouteGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const user = localStorage.getItem("user")
  const isProtectedRoute = useMemo(() => {
    return protectedRoutes.some((route) => route.pattern.test(pathname));
  }, [pathname]);
//  console.log(user);
 
 

  return <>{children}</>;
}
