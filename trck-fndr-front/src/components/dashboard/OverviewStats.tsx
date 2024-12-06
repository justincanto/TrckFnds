"use client";

import {
  LucideDollarSign,
  LucideLandmark,
  LucideTrendingDown,
  LucideTrendingUp,
} from "lucide-react";
import StatModule from "./StatModule";
import axios from "axios";
import { useEffect, useState } from "react";

const getOverviewStats = async () => {
  return axios.get("http://localhost:3001/portfolio/overview", {
    withCredentials: true,
  });
};

const formatCurrency = (value: number | undefined) => {
  if (value === undefined) {
    return null;
  }
  return `$${value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
};

const formatPercentage = (value: number | undefined) => {
  return value === undefined ? null : `${value?.toFixed(2)}%`;
};

export const OverviewStats = () => {
  const [overviewStats, setOverviewStats] = useState<null | {
    balance: number;
    cashflow: {
      expenses: {
        current: number;
        evolution: number;
        isFavorable: boolean;
      };
      revenues: {
        current: number;
        evolution: number;
        isFavorable: boolean;
      };
      savingRate: {
        current: number;
        evolution: number;
        isFavorable: boolean;
      };
    };
  }>(null);
  useEffect(() => {
    getOverviewStats().then((response) => {
      setOverviewStats(response.data);
    });
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatModule
        title={"Portfolio Value"}
        value={formatCurrency(overviewStats?.balance)}
        evolution={"+19% from last month"}
        icon={<LucideDollarSign className="h-4 w-4 text-muted-foreground" />}
      />
      <StatModule
        title={"Total Revenue"}
        value={formatCurrency(overviewStats?.cashflow.revenues.current)}
        evolution={"+20.1% from last month"}
        icon={<LucideTrendingUp className="h-4 w-4 text-muted-foreground" />}
      />
      <StatModule
        title={"Expenses"}
        value={formatCurrency(overviewStats?.cashflow.expenses.current)}
        evolution={"+180.1% from last month"}
        icon={<LucideTrendingDown className="h-4 w-4 text-muted-foreground" />}
      />
      <StatModule
        title={"Savings rate"}
        value={formatPercentage(overviewStats?.cashflow.savingRate.current)}
        evolution={"+1.1% from last month"}
        icon={<LucideLandmark className="h-4 w-4 text-muted-foreground" />}
      />
    </div>
  );
};
