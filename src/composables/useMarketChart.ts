import { onBeforeUnmount, onMounted, watch, type Ref } from "vue";
import {
  CandlestickSeries,
  ColorType,
  CrosshairMode,
  createChart,
  type CandlestickData,
  type IChartApi,
  type ISeriesApi,
  type UTCTimestamp,
} from "lightweight-charts";
import type { Candle } from "@/types/market";
import type { ChartSettings } from "@/types/chart";
import { getCssVariableValue } from "@/utils/getCssVariableValue";

export function useMarketChart(
  chartContainer: Ref<HTMLElement | null>,
  candles: Ref<Candle[]>,
  settings: Ref<ChartSettings>,
) {
  let chart: IChartApi | null = null;
  let candleStickSeries: ISeriesApi<"Candlestick">;

  let candleArray: CandlestickData[] = [];

  const chartOptions = {
    autoSize: true,
    layout: {
      background: { type: ColorType.Solid, color: "transparent" },
      textColor: getCssVariableValue("--chart-x-font-color", "#9aa4b5"),
      fontFamily: "Pretendard",
    },
    grid: {
      vertLines: { color: "transparent" },
      horzLines: {
        color: getCssVariableValue("--chart-grid", "#1f2633"),
        lineWidth: 1 as const,
      },
    },
    crosshair: { mode: CrosshairMode.Normal },
    rightPriceScale: {
      visible: true,
      borderColor: "transparent",
      ticksVisible: true,
    },
    timeScale: {
      barSpacing: 11,
      rightOffset: 10,
      timeVisible: true,
      borderColor: "#454951",
    },
  };

  // 차트용 캔들 배열 생성
  function makeChartData(): void {
    candleArray = [];
    const list = candles.value;
    for (let i = 0; i < list.length; i++) {
      candleArray.push({
        time: list[i].time as UTCTimestamp,
        open: list[i].open,
        high: list[i].high,
        low: list[i].low,
        close: list[i].close,
      });
    }
  }

  function setChartData(): void {
    makeChartData();
    candleStickSeries.setData(candleArray);
    chart?.timeScale().fitContent();
  }

  onMounted(() => {
    if (!chartContainer.value) return;
    chart = createChart(chartContainer.value, chartOptions);

    candleStickSeries = chart.addSeries(CandlestickSeries, {
      title: "Candle",
      priceScaleId: "right",
      upColor: settings.value.candleUpColor,
      downColor: settings.value.candleDownColor,
      borderVisible: false,
      wickUpColor: settings.value.candleUpColor,
      wickDownColor: settings.value.candleDownColor,
      priceFormat: { type: "price", precision: 2, minMove: 0.01 },
    });
    candleStickSeries.priceScale().applyOptions({
      autoScale: true,
      scaleMargins: { top: 0.1, bottom: 0.3 },
    });

    setChartData();
  });

  watch(candles, () => chart && setChartData());

  onBeforeUnmount(() => {
    if (chart) {
      chart.remove();
      chart = null;
    }
  });
}
