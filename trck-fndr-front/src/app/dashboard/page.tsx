"use client";

import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartConfig } from "@/components/ui/chart";
import BarChartRenderer from "@/components/renderer/BarChartRenderer";
import AreaChartRenderer from "@/components/renderer/AreaChartRenderer";
import PieChartRenderer from "@/components/renderer/PieChartRenderer";
import ChartModule from "@/components/dashboard/ChartModule";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { OverviewStats } from "@/components/dashboard/OverviewStats";
import { LogOutIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { PortfolioData } from "@/types/portfolio";
import { formatCurrency } from "@/utils/format";
import { AssetsAccordion } from "@/components/dashboard/AssetsAccordion";

const chartConfig = {
  desktop: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Expenses",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

const pieChartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-1)" },
  { browser: "safari", visitors: 200, fill: "var(--color-2)" },
  { browser: "firefox", visitors: 287, fill: "var(--color-3)" },
  { browser: "edge", visitors: 173, fill: "var(--color-4)" },
  { browser: "other", visitors: 190, fill: "var(--color-5)" },
];

const pieChartConfig = {
  1: {
    color: "hsl(var(--chart-1))",
  },
  2: {
    color: "hsl(var(--chart-2))",
  },
  3: {
    color: "hsl(var(--chart-3))",
  },
  4: {
    color: "hsl(var(--chart-4))",
  },
  5: {
    color: "hsl(var(--chart-5))",
  },
};

const subscriptionChartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const subscriptionChartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig;

const getPortfolioData = async () => {
  return axios.get("http://localhost:3001/portfolio/overview", {
    withCredentials: true,
  });
};

const getPortfolioEvolution = async () => {
  return axios.get("http://localhost:3001/portfolio/evolution", {
    withCredentials: true,
  });
};

export default function Home() {
  const [portfolioData, setPortfolioData] = useState<null | PortfolioData>(
    null
  );
  const [portfolioEvolution, setPortfolioEvolution] = useState<
    null | { balance: number; date: string }[]
  >(null);

  useEffect(() => {
    getPortfolioData().then((response) => {
      setPortfolioData(response.data);
    });
    getPortfolioEvolution().then((response) => {
      setPortfolioEvolution(response.data.portfolioEvolution);
    });
  }, []);

  const balanceByCategory = useMemo(() => {
    return portfolioData?.assets.map((asset, i) => ({
      category: asset.category,
      balance: asset.balance,
      formattedBalance: formatCurrency(asset.balance)!,
      fill: `var(--color-${i + 1})`,
    }));
  }, [portfolioData]);

  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/dashboard-light.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="block dark:hidden"
        />
        <Image
          src="/examples/dashboard-dark.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden flex-col md:flex">
        {/*<div className="border-b">*/}
        {/*  <div className="flex h-16 items-center px-4">*/}
        {/*    <TeamSwitcher />*/}
        {/*    <MainNav className="mx-6" />*/}
        {/*    <div className="ml-auto flex items-center space-x-4">*/}
        {/*      <Search />*/}
        {/*      <UserNav />*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</div>*/}
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <button
              className="rounded-full p-1.5 border border-white"
              onClick={async () => await signOut()}
            >
              <LogOutIcon className="w-4 h-4" />
            </button>
          </div>
          <Button
            onClick={async () =>
              await axios.get("http://localhost:3001/bank/connection-url", {
                withCredentials: true,
              })
            }
          >
            Add connection
          </Button>
          <Button
            onClick={async () =>
              await axios.get("http://localhost:3001/portfolio/evolution", {
                withCredentials: true,
              })
            }
          >
            Get evolution
          </Button>
          <Tabs defaultValue="cashflow" className="space-y-4">
            <TabsList>
              <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
              <TabsTrigger value="analytics" disabled>
                Analytics
              </TabsTrigger>
              <TabsTrigger value="reports" disabled>
                Reports
              </TabsTrigger>
              <TabsTrigger value="notifications" disabled>
                Notifications
              </TabsTrigger>
            </TabsList>
            <TabsContent value="cashflow" className="space-y-4">
              <OverviewStats portfolioData={portfolioData} />
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <ChartModule
                  className="col-span-4"
                  title={"Overview"}
                  description={"Detailed view of revenue & expenses"}
                >
                  <AreaChartRenderer
                    chartConfig={chartConfig}
                    chartData={portfolioEvolution!}
                    dataKey="balance"
                    axisDataKey="date"
                  />
                </ChartModule>
                <>
                  {balanceByCategory && (
                    <ChartModule
                      className="col-span-3"
                      title={"Portfolio Breakdown"}
                      description={"Assets by category"}
                    >
                      <PieChartRenderer
                        chartConfig={pieChartConfig}
                        dataKey="balance"
                        nameKey="category"
                        chartData={balanceByCategory}
                        total={portfolioData?.balance}
                        totalLabel="Portfolio Value"
                      />
                    </ChartModule>
                  )}
                </>
              </div>
              <AssetsAccordion assets={portfolioData?.assets} />
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <ChartModule
                  className="col-span-3"
                  title={"Revenue Breakdown"}
                  description={"Detailed view of revenue"}
                >
                  <PieChartRenderer
                    dataKey="visitors"
                    nameKey="browser"
                    chartConfig={pieChartConfig}
                    chartData={pieChartData}
                  />
                </ChartModule>
                <ChartModule
                  className="col-span-4"
                  title={"Cash Flow Breakdown"}
                  description={"Detailed view of cash flow"}
                >
                  <AreaChartRenderer
                    chartConfig={chartConfig}
                    chartData={portfolioEvolution!}
                    dataKey="balance"
                    axisDataKey="date"
                  />
                </ChartModule>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <ChartModule
                  title={"Subscriptions"}
                  description={"Detail view of all subscriptions"}
                  className="col-span-4"
                >
                  <BarChartRenderer
                    chartConfig={subscriptionChartConfig}
                    chartData={subscriptionChartData}
                  />
                </ChartModule>
                <ChartModule
                  className="col-span-3"
                  title={"Expenses Breakdown"}
                  description={"Detailed view of expenses"}
                >
                  <PieChartRenderer
                    dataKey="visitors"
                    nameKey="browser"
                    chartConfig={pieChartConfig}
                    chartData={pieChartData}
                  />
                </ChartModule>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
