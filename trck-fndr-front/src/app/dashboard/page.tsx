"use client";

import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartConfig } from "@/components/ui/chart";
import BarChartRenderer from "@/components/renderer/BarChartRenderer";
import AreaChartRenderer from "@/components/renderer/AreaChartRenderer";
import PieChartRenderer from "@/components/renderer/PieChartRenderer";
import ChartModule from "@/components/dashboard/ChartModule";
import { OverviewStats } from "@/components/dashboard/OverviewStats";

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

const data = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const pieChartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 287, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 190, fill: "var(--color-other)" },
];
const pieChartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

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

export default function Home() {
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
            {/* <div className="rounded-full h-5 w-5 border border-white">

          </div> */}
          </div>
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
              <OverviewStats />
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <ChartModule
                  className="col-span-4"
                  title={"Overview"}
                  description={"Detailed view of revenue & expenses"}
                >
                  <AreaChartRenderer
                    chartConfig={chartConfig}
                    chartData={data}
                  />
                </ChartModule>
                <ChartModule
                  className="col-span-3"
                  title={"Expenses Breakdown"}
                  description={"Detailed view of expenses"}
                >
                  <PieChartRenderer
                    chartConfig={pieChartConfig}
                    chartData={pieChartData}
                  />
                </ChartModule>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <ChartModule
                  className="col-span-3"
                  title={"Revenue Breakdown"}
                  description={"Detailed view of revenue"}
                >
                  <PieChartRenderer
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
                    chartData={data}
                  />
                </ChartModule>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <ChartModule
                  title={"Subscriptions"}
                  description={"Detail view of all subscriptions"}
                  className="col-span-3"
                >
                  <BarChartRenderer
                    chartConfig={subscriptionChartConfig}
                    chartData={subscriptionChartData}
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
