import { PricingSection } from "@/components/home/pricing";
import { SignIn } from "@/components/trckfndr/signIn";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ReactNode } from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <svg
            className="w-8 h-8 text-emerald-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <span className="text-2xl font-bold">TrckFndr</span>
        </div>
        <SignIn />
      </header>

      <main>
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Simplify Your Finances with TrckFndr
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Effortlessly track, manage, and optimize your finances with our
            intuitive SaaS solution.
          </p>
          <Button
            size="lg"
            className="mr-4 bg-emerald-600 hover:bg-emerald-700"
          >
            Get Started
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-gray-100 bg-transparent"
          >
            Learn More
          </Button>
        </section>

        <section className="container mx-auto px-4 py-20">
          <div className="grid md:grid-cols-3 gap-12">
            <FeatureSection
              title="Easy Tracking"
              description="Automatically import and categorize your transactions for effortless financial management."
              icon={
                <svg
                  className="w-12 h-12 text-emerald-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
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
                  className="w-12 h-12 text-emerald-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
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
                  className="w-12 h-12 text-emerald-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
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
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Join thousands of users who have simplified their financial
            management with TrckFndr.
          </p>
          <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
            Start Your Free Trial
          </Button>
        </section>
      </main>

      <footer className="container mx-auto px-4 py-8 text-center text-gray-500 border-t border-gray-800">
        <p>&copy; 2024 TrckFndr. All rights reserved.</p>
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
      <p className="text-gray-400">{description}</p>
    </div>
  );
}
