/**
 * Форматирует число с разделителями тысяч
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('ru-RU').format(value)
}

/**
 * Форматирование цены в российских рублях
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
}

/**
 * Форматирование площади с разделителями разрядов
 */
export function formatArea(area: number): string {
  return new Intl.NumberFormat('ru-RU').format(area);
} 