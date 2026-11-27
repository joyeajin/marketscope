<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useMarketData } from "@/composables/useMarketData";
import AssetList from "@/components/market/AssetList.vue";
import AssetSummary from "@/components/market/AssetSummary.vue";
import ChartToolbar from "@/components/chart/ChartToolbar.vue";
import MarketChart from "@/components/chart/MarketChart.vue";

const { marketStore, chartStore } = useMarketData();

const { assets, selectedId, selectedAsset, candles } = storeToRefs(marketStore);

const { interval, settings } = storeToRefs(chartStore);
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
      <ChartToolbar
        :interval="interval"
        @update:interval="chartStore.changeInterval"
      />
      <MarketChart :candles="candles" :settings="settings" />
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
