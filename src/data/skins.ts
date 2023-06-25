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
  new PlayerSkin({
    name: 'Oorod',
    index: 5,
    file: Images.SKIN5,
    handFile: Images.SKIN5_HAND,
  }),
  new PlayerSkin({
    name: 'Purple Wolf',
    index: 6,
    file: Images.SKIN6,
    handFile: Images.SKIN6_HAND,
  }),
  new PlayerSkin({
    name: 'Mini Red',
    index: 7,
    file: Images.SKIN7,
    handFile: Images.SKIN7_HAND,
  }),
  new PlayerSkin({
    name: 'Yellow Bitten',
    index: 8,
    file: Images.SKIN8,
    handFile: Images.SKIN8_HAND,
  }),
]

export const skinByName = (index: number): PlayerSkin => {
  return PlayerSkins.find((s) => s.index === index) || skinByName(1)
}
//
