<script setup lang="ts">
import type { Asset, AssetId } from "@/types/market";
import { formatPercent, formatPrice } from "@/utils/formatters";

defineProps<{
  asset: Asset;
  active: boolean;
}>();

defineEmits<{
  (e: "select", id: AssetId): void;
}>();
</script>

<template>
  <li :class="['item', { active }]" @click="$emit('select', asset.id)">
    <div class="name">
      <strong>{{ asset.symbol }}</strong>
      <p>{{ asset.name }}</p>
    </div>

    <div class="price">
      <span>{{ formatPrice(asset.price) }}</span>
      <span :class="asset.changePercent >= 0 ? 'up' : 'down'">
        {{ formatPercent(asset.changePercent) }}
      </span>
    </div>
  </li>
</template>

<style scoped lang="scss">
.item {
  display: flex;
  justify-content: space-between;
  padding: 12px 14px;
  border-radius: 12px;
  cursor: pointer;

  &:hover,
  &.active {
    background: rgba(255, 255, 255, 0.06);
  }
}

.name p {
  font-size: 12px;
  color: var(--sub);
}

.price {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 14px;
}

.up {
  color: var(--up);
}

.down {
  color: var(--down);
}
</style>
