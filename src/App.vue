<script setup lang="ts">
import MarketChart from "@/components/chart/MarketChart.vue";
import { generateCandles, mockAssets } from "@/mocks/marketData";
import { DEFAULT_CHART_SETTINGS } from "@/types/chart";

const candles = generateCandles(mockAssets[0], "1M");
</script>

<template>
  <div style="padding: 24px">
    <MarketChart :candles="candles" :settings="DEFAULT_CHART_SETTINGS" />
  </div>
</template>
