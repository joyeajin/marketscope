<script setup lang="ts">
import { onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { useMarketStore } from "@/stores/marketStore";
import { DEFAULT_CHART_SETTINGS } from "@/types/chart";
import AssetList from "@/components/market/AssetList.vue";
import AssetSummary from "@/components/market/AssetSummary.vue";
import MarketChart from "@/components/chart/MarketChart.vue";

const marketStore = useMarketStore();

const { assets, selectedId, selectedAsset, candles } = storeToRefs(marketStore);

// 첫 진입 시 자산 목록 조회 (첫 번째 자산이 자동 선택됨)
onMounted(() => {
  marketStore.fetchAssetList();
});

// 선택된 자산이 바뀌면 캔들 데이터 다시 조회
watch(selectedId, () => {
  marketStore.fetchCandleList("1M");
});
</script>

<template>
  <div class="dashboard">
    <AssetList
      :assets="assets"
      :selected-id="selectedId"
      @select="marketStore.selectAsset"
    />

    <section class="card main">
      <AssetSummary :asset="selectedAsset" />
      <MarketChart :candles="candles" :settings="DEFAULT_CHART_SETTINGS" />
    </section>
  </div>
</template>

<style scoped lang="scss">
.dashboard {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 20px;
  align-items: start;
}

.main {
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
  padding: 20px;
}

@media (max-width: 1024px) {
  .dashboard {
    grid-template-columns: 1fr;
  }
}
</style>
