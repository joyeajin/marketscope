import { defineStore } from "pinia";
import { ref } from "vue";

import { DEFAULT_CHART_SETTINGS } from "@/types/chart";

import type { ChartInterval, ChartSettings } from "@/types/chart";

export const useChartStore = defineStore("chart", () => {
  // ==========================================
  // State
  // ==========================================

  const interval = ref<ChartInterval>("1M");

  const settings = ref<ChartSettings>({ ...DEFAULT_CHART_SETTINGS });

  // ==========================================
  // 기간 변경
  // ==========================================

  const changeInterval = (value: ChartInterval) => {
    interval.value = value;
  };

  // ==========================================
  // 설정 변경 / 초기화
  // ==========================================

  const updateSettings = (patch: Partial<ChartSettings>) => {
    settings.value = { ...settings.value, ...patch };
  };

  const resetSettings = () => {
    settings.value = { ...DEFAULT_CHART_SETTINGS };
  };

  return {
    interval,

    settings,

    changeInterval,

    updateSettings,

    resetSettings,
  };
});
