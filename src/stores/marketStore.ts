import { defineStore } from "pinia";
import { computed, ref, shallowRef } from "vue";

import { fetchAssets, fetchCandles } from "@/services/marketApi";

import type { Asset, AssetId, Candle } from "@/types/market";
import type { ChartInterval } from "@/types/chart";

export const useMarketStore = defineStore("market", () => {
  // ==========================================
  // State
  // ==========================================

  const assets = ref<Asset[]>([]);

  const selectedId = ref<AssetId | null>(null);

  // 캔들 수백 개는 깊은 반응성이 필요 없어서 shallowRef 사용
  const candles = shallowRef<Candle[]>([]);

  const lastTick = shallowRef<Candle | null>(null);

  const isLoading = ref(false);

  const error = ref<string | null>(null);

  let requestId = 0;

  let liveTimer: number | undefined;

  // ==========================================
  // Getters
  // ==========================================

  const selectedAsset = computed(
    () => assets.value.find((item) => item.id === selectedId.value) ?? null,
  );

  // ==========================================
  // 자산 목록 조회
  // ==========================================

  const fetchAssetList = async () => {
    try {
      assets.value = await fetchAssets();

      // 첫 진입 시 첫 번째 자산 선택
      if (!selectedId.value && assets.value.length > 0) {
        selectedId.value = assets.value[0].id;
      }
    } catch (err) {
      console.error("자산 목록 조회 실패:", err);

      error.value = "자산 목록을 불러오는 데 실패했습니다.";
    }
  };

  // ==========================================
  // 캔들 데이터 조회
  // ==========================================

  const fetchCandleList = async (interval: ChartInterval) => {
    if (!selectedId.value) return;

    // 자산을 빠르게 바꿀 때 이전 응답이 덮어쓰지 않도록 요청 번호 확인
    const currentRequestId = ++requestId;

    isLoading.value = true;

    error.value = null;

    try {
      const data = await fetchCandles(selectedId.value, interval);

      if (currentRequestId !== requestId) return;

      candles.value = data;

      lastTick.value = null;
    } catch (err) {
      if (currentRequestId !== requestId) return;

      console.error("캔들 데이터 조회 실패:", err);

      error.value = "차트 데이터를 불러오는 데 실패했습니다.";
    } finally {
      if (currentRequestId === requestId) {
        isLoading.value = false;
      }
    }
  };

  // ==========================================
  // 자산 선택
  // ==========================================

  const selectAsset = (id: AssetId) => {
    selectedId.value = id;
  };

  // ==========================================
  // 가상 데이터 자동 갱신 (실제 실시간 시세 아님)
  // ==========================================

  const tick = () => {
    const list = candles.value;

    const last = list[list.length - 1];

    if (!last) return;

    const close = last.close * (1 + (Math.random() - 0.5) * 0.004);

    const next: Candle = {
      ...last,
      close,
      high: Math.max(last.high, close),
      low: Math.min(last.low, close),
      volume: last.volume + Math.round(Math.random() * 3000),
    };

    list[list.length - 1] = next;

    lastTick.value = next;

    const asset = assets.value.find((item) => item.id === selectedId.value);

    if (asset) {
      asset.price = close;

      asset.changePercent = ((close - list[0].open) / list[0].open) * 100;
    }
  };

  const startLive = (ms = 1000) => {
    stopLive();

    liveTimer = window.setInterval(tick, ms);
  };

  const stopLive = () => {
    window.clearInterval(liveTimer);
  };

  return {
    assets,
    selectedId,
    candles,
    lastTick,
    isLoading,
    error,

    selectedAsset,

    fetchAssetList,
    fetchCandleList,
    selectAsset,
    startLive,
    stopLive,
  };
});
