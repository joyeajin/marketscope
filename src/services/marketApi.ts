import type { Asset, AssetId, Candle } from "@/types/market";
import type { ChartInterval } from "@/types/chart";

import { generateCandles, mockAssets } from "@/mocks/marketData";

// ==========================================
// 네트워크 지연 흉내
// ==========================================

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

// ==========================================
// 자산 목록 조회
// ==========================================

export const fetchAssets = async (): Promise<Asset[]> => {
  await delay(250);

  return mockAssets.map((asset) => ({ ...asset }));

  //  실제 API로 교체할 때 아래처럼 수정하면 됨.
  //   const response = await apiClient.get("/assets");
  //   return response.data;
};

// ==========================================
// 캔들 데이터 조회
// ==========================================

export const fetchCandles = async (
  assetId: AssetId,
  interval: ChartInterval,
): Promise<Candle[]> => {
  await delay(350);

  const asset = mockAssets.find((item) => item.id === assetId);

  if (!asset) {
    throw new Error(`존재하지 않는 자산입니다: ${assetId}`);
  }

  return generateCandles(asset, interval);
};
