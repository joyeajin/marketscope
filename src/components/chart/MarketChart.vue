<script setup lang="ts">
import { ref, toRef } from "vue";
import type { Candle } from "@/types/market";
import type { ChartSettings } from "@/types/chart";
import { useMarketChart } from "@/composables/useMarketChart";

const props = defineProps<{
  candles: Candle[];
  settings: ChartSettings;
}>();

const chartContainer = ref<HTMLElement | null>(null);

useMarketChart(
  chartContainer,
  toRef(props, "candles"),
  toRef(props, "settings"),
);
</script>

<template>
  <div ref="chartContainer" class="chart" />
</template>

<style scoped lang="scss">
.chart {
  width: 100%;
  height: 460px;
}
</style>
