import { PlayerSkin, PlayerSkinName } from 'src/game/types/player.types'
import { Images } from '../structures/image-base'

export const PlayerSkins: PlayerSkin[] = [
  new PlayerSkin({
    name: 'Snake',
    index: 1,
    file: Images.SKIN1,
    handFile: Images.SKIN1_HAND,
  }),
  new PlayerSkin({
    name: 'Repeat',
    index: 2,
    file: Images.SKIN2,
    handFile: Images.SKIN2_HAND,
  }),
  new PlayerSkin({
    name: 'Skeleton',
    index: 3,
    file: Images.SKIN3,
    handFile: Images.SKIN3_HAND,
  }),
  new PlayerSkin({
    name: 'Shadow',
    index: 4,
    file: Images.SKIN4,
    handFile: Images.SKIN4_HAND,
  }),
]

export const skinByName = (index: number): PlayerSkin => {
  return PlayerSkins.find((s) => s.index === index) || skinByName(3)
}
//
