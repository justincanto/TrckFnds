"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SubscriptionSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-2">Subscription Success 🎉</h1>
      <p className="mb-4">Thank you for subscribing!</p>
      <Button asChild variant="outline">
        <Link href="/dashboard">Go to Dashboard</Link>
      </Button>
    </div>
  );
}
