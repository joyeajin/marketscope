import { onMounted, watch } from "vue";
import { storeToRefs } from "pinia";

import { useMarketStore } from "@/stores/marketStore";
import { useChartStore } from "@/stores/chartStore";

// ==========================================
// 자산 목록 조회 + 자산/기간 변경 시 캔들 재조회
// ==========================================

export function useMarketData() {
  const marketStore = useMarketStore();

  const chartStore = useChartStore();

  const { selectedId } = storeToRefs(marketStore);

  const { interval } = storeToRefs(chartStore);

  // 첫 진입 시 자산 목록 조회 (첫 번째 자산이 자동 선택됨)
  onMounted(() => {
    marketStore.fetchAssetList();
  });

  // 자산이나 기간이 바뀌면 캔들 데이터 다시 조회
  watch([selectedId, interval], () => {
    marketStore.fetchCandleList(interval.value);
  });

  return { marketStore, chartStore };
}
