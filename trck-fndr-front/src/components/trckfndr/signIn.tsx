"use client";

import { signIn, useSession } from "next-auth/react";
import { Button } from "../ui/button";
import Link from "next/link";
import { LucideArrowUpRight } from "lucide-react";

export const SignIn = () => {
  const { data: user } = useSession();

  if (!user) {
    return (
      <Button
        onClick={() =>
          signIn("google", {
            redirectTo: process.env.NEXT_PUBLIC_BASE_URL + "/dashboard",
          })
        }
        variant="outline"
        className="border border-emerald-50 bg-transparent"
      >
        Sign In
      </Button>
    );
  }
  //@ts-expect-error needed because of drizzle adapter wrong typing
  return user.user.isSubscribed ? (
    <Link href="/dashboard" className="flex items-center">
      Dashboard
      <LucideArrowUpRight className="w-4 h-4 ml-1" />
    </Link>
  ) : (
    <Link href="#pricing" className="flex items-center">
      Subscribe
      <LucideArrowUpRight className="w-4 h-4 ml-1" />
    </Link>
  );
};
