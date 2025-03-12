"use client";

import { ChartConfig } from "@/components/ui/chart";
import AreaChartRenderer from "@/components/renderer/AreaChartRenderer";
import PieChartRenderer from "@/components/renderer/PieChartRenderer";
import ChartModule from "@/components/dashboard/ChartModule";
import axios from "axios";
import { OverviewStats } from "@/components/dashboard/OverviewStats";
import { LogOutIcon, UserIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { PortfolioData } from "@/types/portfolio";
import { formatCurrency } from "@/utils/format";
import { AssetsAccordion } from "@/components/dashboard/AssetsAccordion";
import { AddConnection } from "@/components/dashboard/add-connection/AddConnection";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ASSET_CATEGORY_LABEL } from "@/constants/portfolio";

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

const getPortfolioEvolution = async () => {
  return axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/portfolio/evolution`,
    {
      withCredentials: true,
    }
  );
};

const createPortalSession = async () => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/subscription/create-portal-session`,
    {
      withCredentials: true,
    }
  );

  const { sessionUrl } = res.data;
  window.location = sessionUrl;
};

export default function Dashboard() {
  const [portfolioData, setPortfolioData] = useState<null | PortfolioData>(
    null
  );
  const [portfolioEvolution, setPortfolioEvolution] = useState<
    null | { balance: number; date: string }[]
  >(null);

  const { data: session } = useSession();

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
      category: ASSET_CATEGORY_LABEL[asset.category],
      balance: asset.balance,
      formattedBalance: formatCurrency(asset.balance)!,
      fill: `var(--color-${i + 1})`,
    }));
  }, [portfolioData]);

  return (
    <div className="flex-col flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center gap-x-4">
            <AddConnection />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1.5">
                  <UserIcon className="w-5 h-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={createPortalSession}>
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600 flex justify-between"
                  onClick={async () => await signOut()}
                >
                  Logout
                  <LogOutIcon />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {session?.user?.hasConnections ? (
          <div className="space-y-4">
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
