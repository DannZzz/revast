import { Point, Size } from 'src/global/global'
import { BiomeOptions, Biome, GameMap, Biomes } from 'src/structures/GameMap'
import { AssetLink } from 'src/structures/Transformer'
import { Exclude, Expose, Transform, Type } from 'class-transformer'

export class MapEntity implements GameMap {
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
  @Transform(({ value }) => Object.values(value))
  biomes: Biomes

  @Exclude()
  mapSource: string

  constructor(data: GameMap) {
    Object.assign(this, data)
  }

  @Exclude()
  biomeOf(point: Point): Biome {
    throw new Error('Method not implemented.')
  }

  @Exclude()
  absoluteBiome(biome: Biome): BiomeOptions {
    throw new Error('Method not implemented.')
  }
}
