"use client";

import { ChartConfig } from "@/components/ui/chart";
import AreaChartRenderer from "@/components/renderer/AreaChartRenderer";
import PieChartRenderer from "@/components/renderer/PieChartRenderer";
import ChartModule from "@/components/dashboard/ChartModule";
import axios from "axios";
import { OverviewStats } from "@/components/dashboard/OverviewStats";
import { LogOutIcon, UserIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PortfolioData } from "@/types/portfolio";
import { formatCurrency } from "@/utils/format";
import { AssetsAccordion } from "@/components/dashboard/AssetsAccordion";
import { AddConnection } from "@/components/dashboard/add-connection/AddConnection";
import { ASSET_CATEGORY_LABEL } from "@/constants/portfolio";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TimeRange,
  TIME_RANGE_LABEL,
  RevenuesAndExpensesByMonth,
} from "@trckfnds/shared";
import BarChartRenderer from "@/components/renderer/BarChartRenderer";
import { useUser } from "@/providers/user";
import { logout } from "@/services/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const areaChartConfig = {
  balance: {
    label: "Balance",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const barChartConfig = {
  revenues: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
  expenses: {
    label: "Expenses",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

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

const getPortfolioData = async () => {
  return axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/portfolio/overview`,
    {
      withCredentials: true,
    }
  );
};

const getPortfolioEvolution = async (timeRange: TimeRange) => {
  return axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/portfolio/evolution`,
    {
      params: { timeRange },
      withCredentials: true,
    }
  );
};

const getRevenuesAndExpensesEvolution = async () => {
  return axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/portfolio/revenues-expenses/evolution`,
    {
      withCredentials: true,
    }
  );
};

export default function Dashboard() {
  const [portfolioData, setPortfolioData] = useState<null | PortfolioData>(
    null
  );
  const [portfolioEvolution, setPortfolioEvolution] = useState<
    null | { balance: number; date: string }[]
  >(null);
  const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.MONTH);

  const [revenuesAndExpensesEvolution, setRevenuesAndExpensesEvolution] =
    useState<null | RevenuesAndExpensesByMonth>(null);

  const { user, setUserContext } = useUser();
  const router = useRouter();

  useEffect(() => {
    getPortfolioData().then((response) => {
      setPortfolioData(response.data);
    });
    getPortfolioEvolution(timeRange).then((response) => {
      setPortfolioEvolution(response.data.portfolioEvolution);
    });

    getRevenuesAndExpensesEvolution().then((response) => {
      setRevenuesAndExpensesEvolution(response.data);
    });
  }, [timeRange]);

  const balanceByCategory = useMemo(() => {
    return portfolioData?.assets.map((asset, i) => ({
      category: ASSET_CATEGORY_LABEL[asset.category],
      balance: asset.balance,
      formattedBalance: formatCurrency(asset.balance)!,
      fill: `var(--color-${i + 1})`,
    }));
  }, [portfolioData]);

  const handleLogout = async () => {
    await logout();

    setUserContext(null);
    router.push("/");
  };

  return (
    <div className="flex-col flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center gap-x-4">
            <AddConnection />
            <Button variant="ghost" onClick={handleLogout}>
              {" "}
              <LogOutIcon />
            </Button>
          </div>
        </div>
        {user?.hasConnections ? (
          <div className="space-y-4">
            <OverviewStats portfolioData={portfolioData} />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <ChartModule
                className="col-span-4"
                title={"Overview"}
                description={"Detailed view of revenue & expenses"}
                headerRight={
                  <Select
                    value={timeRange}
                    onValueChange={(value) => setTimeRange(value as TimeRange)}
                  >
                    <SelectTrigger className="w-44">
                      <SelectValue placeholder="Time range" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(TIME_RANGE_LABEL).map((range) => (
                        <SelectItem key={range} value={range}>
                          {TIME_RANGE_LABEL[range as TimeRange]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                }
              >
                <AreaChartRenderer
                  chartConfig={areaChartConfig}
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
            <ChartModule
              className="col-span-3"
              title={"Revenue & Expenses Evolution"}
              description={"Monthly evolution of revenue & expenses"}
            >
              <>
                {revenuesAndExpensesEvolution && (
                  <BarChartRenderer
                    chartConfig={barChartConfig}
                    chartData={Object.keys(revenuesAndExpensesEvolution).map(
                      (month) => ({
                        month: month,
                        expenses: revenuesAndExpensesEvolution[month].expenses,
                        revenues: revenuesAndExpensesEvolution[month].revenues,
                      })
                    )}
                  />
                )}
              </>
            </ChartModule>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-y-4 min-h-[80vh]">
            <h2>No connections yet</h2>
            <p>Connect your first source to start tracking your assets</p>
            <AddConnection />
          </div>
        )}
      </div>
    </div>
  );
}
