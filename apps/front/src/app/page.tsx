import { SignIn } from "@/components/trckfndr/signIn";
import { Button } from "@/components/ui/button";
import {
  ChartColumnIncreasingIcon,
  ChartPieIcon,
  ChartSplineIcon,
  LockIcon,
} from "lucide-react";
import Image from "next/image";
import { ReactNode } from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-emerald-50">
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
          <p className="text-lg text-emerald-50/80 mb-10 max-w-2xl mx-auto">
            Effortlessly track, manage, and optimize your assets and budget.
          </p>
          <Button
            size="lg"
            className="mr-4 bg-emerald-400 hover:bg-emerald-500"
          >
            Get Started
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-emerald-50 bg-transparent text-emerald-50"
            asChild
          >
            <a href="#features">Learn More</a>
          </Button>
        </section>

        <section>
          <div className="w-10/12 mx-auto rounded-xl p-3 bg-emerald-50">
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

        <section className="container mx-auto px-10 pt-40 pb-16" id="features">
          <div className="grid md:grid-cols-3 gap-12">
            <FeatureSection
              title="Easy Tracking"
              description="Aggregate all your assets in one place for effortless financial management."
              icon={<ChartSplineIcon className="w-12 h-12 text-emerald-400" />}
            />
            <FeatureSection
              title="Insightful Analytics"
              description="Gain valuable insights into your spending habits through budget analysis."
              icon={<ChartPieIcon className="w-12 h-12 text-emerald-400" />}
            />
            <FeatureSection
              title="Secure & Private"
              description="Your financial data is safe and access is revocable at anytime."
              icon={<LockIcon className="w-12 h-12 text-emerald-400" />}
            />
          </div>
        </section>

        <section className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="text-lg text-emerald-50/80 mb-10 max-w-2xl mx-auto">
            Start tracking your growth today with TrckFnds.
          </p>
          <Button size="lg" className="bg-emerald-400 hover:bg-emerald-500">
            Create an account
          </Button>
        </section>
      </main>

      <footer className="container mx-auto px-4 py-8 text-center text-emerald-50/60 border-t border-gray-800">
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
      <p className="text-emerald-50/80">{description}</p>
    </div>
  );
}
