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

const formatCurrency = (value: number) => {
  return `$${value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
};

export const OverviewStats = () => {
  const [overviewStats, setOverviewStats] = useState<null | {
    balance: number;
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
        value={overviewStats ? formatCurrency(overviewStats.balance) : null}
        evolution={"+19% from last month"}
        icon={<LucideDollarSign className="h-4 w-4 text-muted-foreground" />}
      />
      <StatModule
        title={"Total Revenue"}
        value={"$12,234"}
        evolution={"+20.1% from last month"}
        icon={<LucideTrendingUp className="h-4 w-4 text-muted-foreground" />}
      />
      <StatModule
        title={"Expenses"}
        value={"$2,350"}
        evolution={"+180.1% from last month"}
        icon={<LucideTrendingDown className="h-4 w-4 text-muted-foreground" />}
      />
      <StatModule
        title={"Savings rate"}
        value={"28%"}
        evolution={"+1.1% from last month"}
        icon={<LucideLandmark className="h-4 w-4 text-muted-foreground" />}
      />
    </div>
  );
};
