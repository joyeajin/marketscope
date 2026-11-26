// 가격: 1,234.56
export const formatPrice = (value: number): string =>
  value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

// 거래량: 1.2M, 35.4K
export const formatVolume = (value: number): string => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;

  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;

  return String(value);
};
