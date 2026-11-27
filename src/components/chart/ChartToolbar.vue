<script setup lang="ts">
import { CHART_INTERVALS } from "@/types/chart";
import type { ChartInterval } from "@/types/chart";

defineProps<{
  interval: ChartInterval;
}>();

defineEmits<{
  (e: "update:interval", value: ChartInterval): void;
  (e: "toggle-settings"): void;
}>();
</script>

<template>
  <div class="toolbar">
    <button
      v-for="item in CHART_INTERVALS"
      :key="item"
      :class="{ on: item === interval }"
      @click="$emit('update:interval', item)"
    >
      {{ item }}
    </button>
    <button class="settings" @click="$emit('toggle-settings')">설정</button>
  </div>
</template>

<style scoped lang="scss">
.toolbar {
  display: flex;
  gap: 4px;
}

button {
  padding: 6px 12px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--sub);
  cursor: pointer;

  &:hover,
  &.on {
    background: rgba(255, 255, 255, 0.08);
    color: var(--text);
  }
}

.settings {
  margin-left: auto;
}
</style>
