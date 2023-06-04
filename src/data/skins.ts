import { PlayerSkin, PlayerSkinName } from 'src/game/types/player.types'
import { Images } from '../structures/image-base'

export const PlayerSkins: PlayerSkin[] = [
  new PlayerSkin({
    name: 'repeat',
    file: Images.BASIC_SKIN,
    handFile: Images.BASIC_SKIN_HAND,
  }),
]

export const skinByName = (name: PlayerSkinName): PlayerSkin =>
  PlayerSkins.find((s) => s.name === name)
//
