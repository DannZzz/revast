export const isNumber = (n: number, min?: number, max?: number) => {
  if (typeof n !== 'number') return false
  if (!n && n !== 0) return false
  if (!min && !max) return true
  if (min && min > n) return false
  if (max && max < n) return false
  return true
}
