<script setup lang="ts">
import { MA_PERIODS } from "@/types/chart";
import type { ChartSettings } from "@/types/chart";

defineProps<{
  settings: ChartSettings;
}>();

defineEmits<{
  (e: "update", patch: Partial<ChartSettings>): void;
  (e: "reset"): void;
}>();
</script>

<template>
  <div class="panel">
    <label>
      상승 색
      <input
        type="color"
        :value="settings.candleUpColor"
        @input="
          $emit('update', {
            candleUpColor: ($event.target as HTMLInputElement).value,
          })
        "
      />
    </label>

    <label>
      하락 색
      <input
        type="color"
        :value="settings.candleDownColor"
        @input="
          $emit('update', {
            candleDownColor: ($event.target as HTMLInputElement).value,
          })
        "
      />
    </label>

    <label>
      이동평균 기간
      <select
        :value="settings.maPeriod"
        @change="
          $emit('update', {
            maPeriod: Number(($event.target as HTMLSelectElement).value),
          })
        "
      >
        <option v-for="period in MA_PERIODS" :key="period" :value="period">
          {{ period }}
        </option>
      </select>
    </label>

    <label>
      <input
        type="checkbox"
        :checked="settings.showVolume"
        @change="
          $emit('update', {
            showVolume: ($event.target as HTMLInputElement).checked,
          })
        "
      />
      거래량
    </label>

    <label>
      <input
        type="checkbox"
        :checked="settings.showMa"
        @change="
          $emit('update', {
            showMa: ($event.target as HTMLInputElement).checked,
          })
        "
      />
      이동평균선
    </label>

    <label>
      <input
        type="checkbox"
        :checked="settings.showGrid"
        @change="
          $emit('update', {
            showGrid: ($event.target as HTMLInputElement).checked,
          })
        "
      />
      그리드
    </label>

    <button class="reset" @click="$emit('reset')">초기화</button>
  </div>
</template>

<style scoped lang="scss">
.panel {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  padding: 12px 14px;
  border: 1px solid var(--line);
  border-radius: 12px;
  font-size: 13px;
}

label {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--sub);
}

select {
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid var(--line);
  background: var(--bg);
  color: var(--text);
}

.reset {
  margin-left: auto;
  padding: 6px 12px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: transparent;
  color: var(--sub);
  cursor: pointer;
}
</style>
