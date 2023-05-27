import { Point, Size } from 'src/global/global'
import {
  BiomeOptions,
  Biome,
  GameMap,
  Biomes,
  MapAreaName,
} from 'src/structures/GameMap'
import { AssetLink } from 'src/structures/Transformer'
import { Exclude, Expose, Transform, Type } from 'class-transformer'
import { UniversalHitbox } from 'src/utils/universal-within'

export class MapEntity implements Partial<GameMap> {
  size: Size
  tileSize: Size

  @AssetLink()
  @Expose()
  get url() {
    return this.mapSource
  }

  @Expose()
  get absoluteSize(): Size {
    return new Size(
      this.size.width * this.tileSize.width,
      this.size.height * this.tileSize.height,
    )
  }

  @Type(() => BiomeOptions)
  biomes: Biomes

  @Exclude()
  mapSource: string

  constructor(data: GameMap) {
    Object.assign(this, data)
  }

  @Exclude()
  biomeOf(hitbox: UniversalHitbox): MapAreaName[] {
    throw new Error('Method not implemented.')
  }

  @Exclude()
  absoluteBiome(name: string): BiomeOptions {
    throw new Error('Method not implemented.')
  }
}
