import type { Candle } from "@/types/market";

export interface LinePoint {
  time: number;
  value: number;
}

// ==========================================
// 단순 이동평균 (SMA)
//
// period개의 종가 평균을 구한다.
// 앞쪽 (period - 1)개 캔들은 값이 없어서 결과에서 빠진다.
// 합계를 매번 새로 구하지 않고 하나 더하고 하나 빼는 방식이라 캔들이 많아져도 빠름.
// ==========================================

export const sma = (candles: Candle[], period: number): LinePoint[] => {
  const result: LinePoint[] = [];

  let sum = 0;

  for (let i = 0; i < candles.length; i++) {
    sum += candles[i].close;

    // 기간을 벗어난 가장 오래된 종가를 합계에서 제거
    if (i >= period) {
      sum -= candles[i - period].close;
    }

    if (i >= period - 1) {
      result.push({
        time: candles[i].time,
        value: sum / period,
      });
    }
  }

  return result;
};
