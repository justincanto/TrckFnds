"use client";

import { Button } from "../ui/button";
import Link from "next/link";
import { LucideArrowUpRight } from "lucide-react";
import { useUser } from "@/providers/user";

export const SignIn = () => {
  const { user } = useUser();

  if (!user) {
    return (
      <Button
        asChild
        variant="outline"
        className="border border-emerald-50 bg-transparent"
      >
        <a href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`}>
          Sign In
        </a>
      </Button>
    );
  }
  return user.isSubscribed ? (
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
