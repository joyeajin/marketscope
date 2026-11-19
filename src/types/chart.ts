export type ChartInterval = "1D" | "1W" | "1M" | "3M";

export const CHART_INTERVALS: ChartInterval[] = ["1D", "1W", "1M", "3M"];

export interface ChartSettings {
  showVolume: boolean;
  showMovingAverage: boolean;
  maPeriod: number;
  showGrid: boolean;
  candleUpColor: string;
  candleDownColor: string;
}

export const DEFAULT_CHART_SETTINGS: ChartSettings = {
  showVolume: true,
  showMovingAverage: true,
  maPeriod: 20,
  showGrid: true,
  candleUpColor: "#26a69a",
  candleDownColor: "#ef5350",
};
