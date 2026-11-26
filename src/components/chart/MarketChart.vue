<script setup lang="ts">
import { ref, toRef } from "vue";
import type { Candle } from "@/types/market";
import type { ChartSettings } from "@/types/chart";
import { useMarketChart } from "@/composables/useMarketChart";
import ChartLegend from "./ChartLegend.vue";

const props = defineProps<{
  candles: Candle[];
  settings: ChartSettings;
}>();

const chartContainer = ref<HTMLElement | null>(null);

const { hovered } = useMarketChart(
  chartContainer,
  toRef(props, "candles"),
  toRef(props, "settings"),
);
</script>

<template>
  <div class="wrap">
    <ChartLegend :candle="hovered" />
    <div ref="chartContainer" class="chart" />
  </div>
</template>

<style scoped lang="scss">
.chart {
  width: 100%;
  height: 460px;
}

.wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
