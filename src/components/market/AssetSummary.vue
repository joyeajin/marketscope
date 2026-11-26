<script setup lang="ts">
import type { Asset } from "@/types/market";
import { formatPercent, formatPrice } from "@/utils/formatters";

defineProps<{
  asset: Asset | null;
}>();
</script>

<template>
  <div v-if="asset" class="summary">
    <h2>
      {{ asset.name }}
      <small>{{ asset.symbol }}</small>
    </h2>

    <div class="price">
      <strong>{{ formatPrice(asset.price) }}</strong>
      <span :class="asset.changePercent >= 0 ? 'up' : 'down'">
        {{ formatPercent(asset.changePercent) }}
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.summary {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 24px;
}

h2 small {
  margin-left: 8px;
  font-size: 14px;
  font-weight: 400;
  color: var(--sub);
}

.price {
  display: flex;
  align-items: baseline;
  gap: 10px;

  strong {
    font-size: 28px;
  }
}

.up {
  color: var(--up);
}

.down {
  color: var(--down);
}
</style>
