import { onBeforeUnmount, onMounted, ref, watch, type Ref } from "vue";
import {
  CandlestickSeries,
  ColorType,
  CrosshairMode,
  HistogramSeries,
  LineSeries,
  createChart,
  type CandlestickData,
  type HistogramData,
  type LineData,
  type MouseEventParams,
  type IChartApi,
  type ISeriesApi,
  type UTCTimestamp,
} from "lightweight-charts";
import { sma } from "@/utils/indicators";
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
  let volumeSeries: ISeriesApi<"Histogram">;

  let candleArray: CandlestickData[] = [];
  let volumeArray: HistogramData[] = [];

  let maLine: ISeriesApi<"Line">;
  let maArray: LineData[] = [];

  const hovered = ref<Candle | null>(null);

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

  // 상승/하락 색에 맞춘 거래량 막대 색
  const getVolumeColor = (c: Candle): string =>
    (c.close >= c.open
      ? settings.value.candleUpColor
      : settings.value.candleDownColor) + "66";

  // 차트용 캔들, 거래량 배열 생성
  function makeChartData(): void {
    candleArray = [];
    volumeArray = [];
    maArray = [];

    const list = candles.value;
    for (let i = 0; i < list.length; i++) {
      const time = list[i].time as UTCTimestamp;

      candleArray.push({
        time,
        open: list[i].open,
        high: list[i].high,
        low: list[i].low,
        close: list[i].close,
      });

      volumeArray.push({
        time,
        value: list[i].volume,
        color: getVolumeColor(list[i]),
      });
    }

    // 이동평균선 데이터 생성
    const maResult = sma(list, settings.value.maPeriod);
    for (let i = 0; i < maResult.length; i++) {
      maArray.push({
        time: maResult[i].time as UTCTimestamp,
        value: maResult[i].value,
      });
    }
  }

  function setChartData(): void {
    makeChartData();
    candleStickSeries.setData(candleArray);
    volumeSeries.setData(volumeArray);
    maLine.setData(maArray);
    chart?.timeScale().fitContent();
  }

  // ==========================================
  // 크로스헤어 범례 (마우스 위치의 OHLCV)
  // ==========================================
  const updateLegend = (param: MouseEventParams): void => {
    // 차트 영역 밖이면 범례 초기화
    if (!param.point || !param.time || param.point.x < 0 || param.point.y < 0) {
      hovered.value = null;
      return;
    }

    const bar = param.seriesData.get(candleStickSeries) as
      | CandlestickData
      | undefined;

    if (!bar) {
      hovered.value = null;
      return;
    }

    // 거래량은 캔들 시리즈에 없어서 volumeArray에서 같은 시간의 값을 찾는다
    const volume = volumeArray.find((v) => v.time === bar.time)?.value ?? 0;

    hovered.value = {
      time: bar.time as number,
      open: bar.open,
      high: bar.high,
      low: bar.low,
      close: bar.close,
      volume,
    };
  };

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

    //  거래량은 별도 스케일로 하단 20% 영역에 표시
    volumeSeries = chart.addSeries(HistogramSeries, {
      priceScaleId: "volume",
      priceFormat: { type: "volume" },
      priceLineVisible: false,
    });
    chart.priceScale("volume").applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    });

    maLine = chart.addSeries(LineSeries, {
      title: "MA",
      priceScaleId: "right",
      lineWidth: 2,
      color: "#f5a524",
      priceLineVisible: false,
      lastValueVisible: false,
    });

    chart.subscribeCrosshairMove(updateLegend);

    setChartData();
  });

  watch(candles, () => chart && setChartData());

  // MA 기간이 바뀌면 데이터 다시 계산
  watch(
    () => settings.value.maPeriod,
    () => chart && setChartData(),
  );

  onBeforeUnmount(() => {
    if (chart) {
      chart.unsubscribeCrosshairMove(updateLegend);

      chart.remove();
      chart = null;
    }
  });

  return { hovered };
}
