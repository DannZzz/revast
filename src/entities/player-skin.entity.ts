import { Exclude, Expose } from 'class-transformer'
import { PlayerSkin, PlayerSkinName } from '../game/types/player.types'
import { AssetLink } from 'src/structures/Transformer'

export class PlayerSkinEntity implements PlayerSkin {
  name: PlayerSkinName

  @Exclude()
  file: string

  @Exclude()
  handFile: string

  @AssetLink()
  @Expose()
  get url() {
    return this.file
  }

  @AssetLink()
  @Expose()
  get handUrl() {
    return this.handFile
  }

  constructor(data: Partial<PlayerSkinEntity>) {
    Object.assign(this, data)
  }

  index: number
}
