"use client";

import {
  LucideDollarSign,
  LucideLandmark,
  LucideTrendingDown,
  LucideTrendingUp,
} from "lucide-react";
import StatModule from "./StatModule";
import { PortfolioData } from "@/types/portfolio";
import {
  formatCurrency,
  formatPercentage,
  formatEvolutionCurrency,
  formatEvolutionPercentage,
} from "@/utils/format";

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
        label={"+19% from last month"}
        icon={<LucideDollarSign className="h-4 w-4 text-muted-foreground" />}
      />
      <StatModule
        title={"Total Revenue"}
        value={formatCurrency(portfolioData?.cashflow.revenues.current)}
        label={`${formatEvolutionCurrency(
          portfolioData?.cashflow.revenues.evolution
        )} from last month`}
        isFavorableLabel={portfolioData?.cashflow.revenues.isFavorable}
        icon={<LucideTrendingUp className="h-4 w-4 text-muted-foreground" />}
      />
      <StatModule
        title={"Expenses"}
        value={formatCurrency(portfolioData?.cashflow.expenses.current)}
        label={`${formatEvolutionCurrency(
          portfolioData?.cashflow.expenses.evolution
        )} from last month`}
        isFavorableLabel={portfolioData?.cashflow.expenses.isFavorable}
        icon={<LucideTrendingDown className="h-4 w-4 text-muted-foreground" />}
      />
      <StatModule
        title={"Savings rate"}
        value={formatPercentage(portfolioData?.cashflow.savingRate.current)}
        label={`${formatEvolutionPercentage(
          portfolioData?.cashflow.savingRate.evolution
        )} from last month`}
        isFavorableLabel={portfolioData?.cashflow.savingRate.isFavorable}
        icon={<LucideLandmark className="h-4 w-4 text-muted-foreground" />}
      />
    </div>
  );
};
