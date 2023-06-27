import { Chest } from 'anytool'
import { BasicBioItem, Bio } from '../game/basic/bio-item.basic'
import { Point } from 'src/global/global'

export const BioItems = new Chest<number, BasicBioItem>()

export const bioItemByMapId = (mapId: number, point: Point): Bio => {
  const item = BioItems.find((item) => item.data.mapId === mapId)
  try {
    const bio = item.generate()
    bio.preCreate(
      new Point(point.x, point.y - item.data.size.height),
      // point,
    )
    return bio
  } catch (e) {
    console.log('bio not found id: ', mapId)
  }
}
