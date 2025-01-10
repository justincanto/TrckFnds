import { PricingSection } from "@/components/home/pricing";
import { SignIn } from "@/components/trckfndr/signIn";
import { Button } from "@/components/ui/button";
import { ChartColumnIncreasingIcon } from "lucide-react";
import Image from "next/image";
import { ReactNode } from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-orange-50">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <ChartColumnIncreasingIcon className="w-6 h-6" />
          <span className="text-2xl font-bold">TrckFnds</span>
        </div>
        <SignIn />
      </header>

      <main>
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-6xl font-bold mb-6 leading-snug">
            Simplify Your Finances.
            <br />
            Grow your portfolio.
          </h1>
          <p className="text-lg text-orange-50/80 mb-10 max-w-2xl mx-auto">
            Effortlessly track, manage, and optimize your assets and budget.
          </p>
          <Button size="lg" className="mr-4 bg-orange-400 hover:bg-orange-500">
            Get Started
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-orange-50 bg-transparent text-orange-50"
          >
            Learn More
          </Button>
        </section>

        <section>
          <div className="w-10/12 mx-auto rounded-xl p-3 bg-orange-50">
            <Image
              src={`/images/home/app-screenshot.png`}
              alt="App screenshot"
              width={0}
              height={0}
              sizes="100vw"
              className="rounded-lg w-full"
            />
          </div>
        </section>

        <section className="container mx-auto px-10 pt-40 pb-16">
          <div className="grid md:grid-cols-3 gap-12">
            <FeatureSection
              title="Easy Tracking"
              description="Automatically import and categorize your transactions for effortless financial management."
              icon={
                <svg
                  className="w-12 h-12 text-orange-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              }
            />
            <FeatureSection
              title="Insightful Analytics"
              description="Gain valuable insights into your spending habits with our powerful analytics tools."
              icon={
                <svg
                  className="w-12 h-12 text-orange-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              }
            />
            <FeatureSection
              title="Secure & Private"
              description="Your financial data is protected with bank-level security and encryption."
              icon={
                <svg
                  className="w-12 h-12 text-orange-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              }
            />
          </div>
        </section>

        <section id="pricing">
          <PricingSection />
        </section>

        <section className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="text-lg text-orange-50/80 mb-10 max-w-2xl mx-auto">
            Join thousands of users who have simplified their financial
            management with TrckFnds.
          </p>
          <Button size="lg" className="bg-orange-400 hover:bg-orange-500">
            Create an account
          </Button>
        </section>
      </main>

      <footer className="container mx-auto px-4 py-8 text-center text-orange-50/60 border-t border-gray-800">
        <p>&copy; 2025 TrckFnds. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FeatureSection({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: ReactNode;
}) {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-orange-50/80">{description}</p>
    </div>
  );
}
