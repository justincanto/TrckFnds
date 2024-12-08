"use client";

import {
  LucideDollarSign,
  LucideLandmark,
  LucideTrendingDown,
  LucideTrendingUp,
} from "lucide-react";
import StatModule from "./StatModule";
import { PortfolioData } from "@/types/portfolio";
import { formatCurrency, formatPercentage } from "@/utils/format";

export const OverviewStats = ({
  portfolioData,
}: {
  portfolioData: PortfolioData | null;
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatModule
        title={"Portfolio Value"}
        value={formatCurrency(portfolioData?.balance)}
        evolution={"+19% from last month"}
        icon={<LucideDollarSign className="h-4 w-4 text-muted-foreground" />}
      />
      <StatModule
        title={"Total Revenue"}
        value={formatCurrency(portfolioData?.cashflow.revenues.current)}
        evolution={"+20.1% from last month"}
        icon={<LucideTrendingUp className="h-4 w-4 text-muted-foreground" />}
      />
      <StatModule
        title={"Expenses"}
        value={formatCurrency(portfolioData?.cashflow.expenses.current)}
        evolution={"+180.1% from last month"}
        icon={<LucideTrendingDown className="h-4 w-4 text-muted-foreground" />}
      />
      <StatModule
        title={"Savings rate"}
        value={formatPercentage(portfolioData?.cashflow.savingRate.current)}
        evolution={"+1.1% from last month"}
        icon={<LucideLandmark className="h-4 w-4 text-muted-foreground" />}
      />
    </div>
  );
};
