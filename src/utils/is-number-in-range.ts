export const isNumber = (n: number, min?: number, max?: number) => {
  if (typeof n !== 'number') return false
  if (!n && n !== 0) return false
  if (!isNumber(min) && !isNumber(max)) return true
  if (isNumber(min) && min > n) return false
  if (isNumber(max) && max < n) return false
  return true
}
