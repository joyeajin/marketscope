import type { Asset, Candle } from "@/types/market";
import type { ChartInterval } from "@/types/chart";

// 데모용 가상 데이터입니다. 실제 시세가 아닙니다.
export const mockAssets: Asset[] = [
  {
    id: "aurx",
    symbol: "AURX",
    name: "Aurora Technologies",
    price: 182.4,
    changePercent: 1.26,
  },
  {
    id: "nvlt",
    symbol: "NVLT",
    name: "Novalite Systems",
    price: 96.1,
    changePercent: -0.84,
  },
  {
    id: "helx",
    symbol: "HELX",
    name: "Helix Biotech",
    price: 54.7,
    changePercent: 3.12,
  },
  {
    id: "orbt",
    symbol: "ORBT",
    name: "Orbit Logistics",
    price: 231.9,
    changePercent: 0.37,
  },
  {
    id: "zeph",
    symbol: "ZEPH",
    name: "Zephyr Energy",
    price: 38.25,
    changePercent: -2.1,
  },
  {
    id: "lumn",
    symbol: "LUMN",
    name: "Lumen Retail",
    price: 120.6,
    changePercent: 0.92,
  },
];

const SPEC: Record<ChartInterval, { step: number; count: number }> = {
  "1D": { step: 15 * 60, count: 96 },
  "1W": { step: 60 * 60, count: 168 },
  "1M": { step: 24 * 3600, count: 30 },
  "3M": { step: 24 * 3600, count: 90 },
};

function hashSeed(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++)
    h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 자산/기간별로 항상 같은 결과를 내는 시드 기반 OHLCV 생성기 */
export function generateCandles(
  asset: Asset,
  interval: ChartInterval,
): Candle[] {
  const { step, count } = SPEC[interval];
  const rand = mulberry32(hashSeed(`${asset.id}-${interval}`));
  const vol = interval === "1D" ? 0.004 : interval === "1W" ? 0.007 : 0.015;
  const end = Math.floor(Date.now() / 1000 / step) * step;
  const candles: Candle[] = [];
  let price = asset.price * (0.9 + rand() * 0.1);
  for (let i = count - 1; i >= 0; i--) {
    const open = price;
    const close = open * (1 + (rand() - 0.47) * vol * 2);
    const high = Math.max(open, close) * (1 + rand() * vol);
    const low = Math.min(open, close) * (1 - rand() * vol);
    const volume = Math.round(
      50_000 + rand() * 150_000 + Math.abs(close - open) * 8_000,
    );
    candles.push({ time: end - i * step, open, high, low, close, volume });
    price = close;
  }
  return candles;
}
