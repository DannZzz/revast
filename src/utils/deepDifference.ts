import { equal } from 'anytool'
import { VisualPlayerData } from 'src/game/types/player.types'

export const deepDifferenceObject = (obj1: object, obj2: object): boolean => {
  if ($(obj1).$size !== $(obj2).$size) return true
  if (
    $(obj1).$some((v, k) => {
      if (typeof v === 'number') {
        return +v.toFixed(5) !== +(obj2[k] as number).toFixed(5)
      } else if (typeof v === 'object' && !Array.isArray(v)) {
        return deepDifferenceObject(v, obj2[k])
      } else {
        return !equal(v, obj2[k])
      }
    })
  )
    return false
}

export const deepDifference = (
  obj1: VisualPlayerData[],
  obj2: VisualPlayerData[],
): boolean => {
  if (obj1.length !== obj2.length) return true
  if (
    obj1.some((v, k) => {
      const v2 = obj2.find((p) => p.id === v.id)
      if (!v2) return true
      return (
        v.point.x !== v2.point.x ||
        v.point.y !== v2.point.y ||
        v.rotation !== v2.rotation ||
        v.clicking.status !== v2.clicking.status ||
        v.equipment?.source !== v2.equipment?.source ||
        v.wearing?.source !== v2.wearing?.source ||
        v.bagSource !== v2.bagSource
      )
    })
  )
    return true
  return false
}
