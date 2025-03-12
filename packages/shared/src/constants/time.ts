import dayjs from "dayjs";

export enum TimeRange {
  WEEK = "1W",
  MONTH = "1M",
  QUARTER = "3M",
  YEAR_TO_DATE = "YTD",
  YEAR = "1Y",
  ALL_TIME = "ALL",
}

export const TIME_RANGE_LABEL: Record<TimeRange, string> = {
  [TimeRange.WEEK]: "1 Week",
  [TimeRange.MONTH]: "1 Month",
  [TimeRange.QUARTER]: "1 Quarter",
  [TimeRange.YEAR_TO_DATE]: "Year to Date",
  [TimeRange.YEAR]: "1 Year",
  [TimeRange.ALL_TIME]: "All Time",
};

export const getTimeRangeStartDate = (
  timeRange: TimeRange,
  today = dayjs()
) => {
  const mappings = {
    [TimeRange.WEEK]: today.subtract(7, "day"),
    [TimeRange.MONTH]: today.subtract(1, "month"),
    [TimeRange.QUARTER]: today.subtract(3, "month"),
    [TimeRange.YEAR_TO_DATE]: today.startOf("year"),
    [TimeRange.YEAR]: today.subtract(1, "year"),
    [TimeRange.ALL_TIME]: today.subtract(10, "year"),
  };

  return mappings[timeRange];
};
