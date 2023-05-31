/**
 *
 * @param percentage percentage example: 12%
 * @param of of number example: 300
 * @returns 300 * 12 / 100 === 36
 */
export const percentOf = (percentage: number, of: number) =>
  (of * percentage) / 100 || 0

/**
 * @param target target number example: 12
 * @param from from number example: 30
 * @returns 12/30*100 === 40%
 */
export const percentFrom = (target: number, from: number) =>
  (target / from) * 100 || 0
