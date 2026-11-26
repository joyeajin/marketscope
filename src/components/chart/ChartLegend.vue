<script setup lang="ts">
import type { Candle } from "@/types/market";
import { formatPrice, formatVolume } from "@/utils/formatters";

defineProps<{
  candle: Candle | null;
}>();
</script>

<template>
  <div class="legend">
    <template v-if="candle">
      <span>O {{ formatPrice(candle.open) }}</span>
      <span>H {{ formatPrice(candle.high) }}</span>
      <span>L {{ formatPrice(candle.low) }}</span>
      <span>C {{ formatPrice(candle.close) }}</span>
      <span>Vol {{ formatVolume(candle.volume) }}</span>
    </template>

    <span v-else class="hint">
      차트 위에 마우스를 올리면 OHLCV가 표시됩니다.
    </span>
  </div>
</template>

<style scoped lang="scss">
.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  min-height: 20px;
  font-size: 13px;
  color: var(--sub);
}

.hint {
  opacity: 0.6;
}
</style>
