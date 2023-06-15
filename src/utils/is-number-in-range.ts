export const isNumber = (n: number, min?: number, max?: number) => {
  if (typeof n !== 'number') return false
  if (!n && n !== 0) return false
  if (!isNumber(min) && !isNumber(max)) return true
  if (min > n) return false
  if (max < n) return false
  return true
}
