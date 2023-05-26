import BioBerry from './bios/berry_map_1'
import BioWood from './bios/wood_map_4'
import BioStone from './bios/stone_map_2'
import BioStone2 from './bios/stone2_map_3'
import BioGold from './bios/gold_map_5'
import BioGold2 from './bios/gold2_map_6'
import BioDiamond from './bios/diamond_map_7'
import BioDiamond2 from './bios/diamond2_map_8'
import BioAmethyst from './bios/amethyst_map_9'
import BioRuby from './bios/ruby_map_10'
import BioEmerald from './bios/emerald_map_11'
import BioWinterTree from './bios/winter_tree_12'

import { Chest } from 'anytool'
import { BasicBioItem, Bio } from '../game/basic/bio-item.basic'
import { Point } from 'src/global/global'

export const BioItems = new Chest<number, BasicBioItem>(
  [
    BioBerry,
    BioWood,
    BioStone,
    BioStone2,
    BioGold,
    BioGold2,
    BioDiamond,
    BioDiamond2,
    BioAmethyst,
    BioRuby,
    BioEmerald,
    BioWinterTree,
  ].map((bio) => [bio.data.mapId, bio]),
)

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
    console.log(mapId)
  }
}
