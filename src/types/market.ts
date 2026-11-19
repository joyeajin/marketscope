export type AssetId = string;

export interface Asset {
  id: AssetId;
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
}

/** time: UTC seconds */
export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type LoadStatus = "idle" | "loading" | "success" | "error";
