"use client";

import { signIn, useSession } from "next-auth/react";
import { Button } from "../ui/button";
import Link from "next/link";
import { LucideArrowUpRight } from "lucide-react";

export const SignIn = () => {
  const { data: user } = useSession();
  return user ? (
    <Link href="/dashboard" className="flex items-center">
      Dashboard
      <LucideArrowUpRight className="w-4 h-4 ml-1" />
    </Link>
  ) : (
    <Button
      onClick={() =>
        signIn("google", {
          redirectTo: process.env.NEXT_PUBLIC_BASE_URL + "/dashboard",
        })
      }
      variant="outline"
      className="border-gray-100 bg-transparent"
    >
      Sign In
    </Button>
  );
};
