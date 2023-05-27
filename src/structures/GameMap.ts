import { boxPoint } from 'intersects'
import { Point, Size } from 'src/global/global'
import { Converter } from './Converter'
import { Exclude } from 'class-transformer'
import { UniversalHitbox, universalWithin } from 'src/utils/universal-within'
import { rectToPolygon } from 'src/utils/polygons'
import { StaticItems } from './StaticItems'

export class BiomeEffect {
  speed: number = 0
  hungry: number = 0
  temperatureDay: number = 0
  temperatureNight: number = 0

  constructor(data: Partial<BiomeEffect> = {}) {
    Object.assign(this, data)
  }
}

export type MapAreaName =
  | 'winter-cave'
  | 'desert-cave'
  | 'winter'
  | 'desert'
  | 'beach'
  | 'forest'
  | 'ocean'

export class BiomeOptions {
  @Exclude()
  name: MapAreaName
  @Exclude()
  type: Biome
  @Exclude()
  priority?: boolean
  size: Size
  point: Point
  bgColor: string
  borderColor?: string
  @Exclude()
  effect: BiomeEffect

  constructor(data: BiomeOptions) {
    Object.assign(this, data)
  }
}

export type AreaStaticItems = { [k in MapAreaName]?: StaticItems }

export enum Biome {
  forest,
  winter,
  beach,
  ocean,
  desert,
  cave,
}

export type Biomes = BiomeOptions[]

export interface GameMapOptions {
  biomes: Biomes
  tileSize: Size
  size: Size
  mapSource: string
}

export class GameMap implements GameMapOptions {
  biomes: Biomes
  private absoluteBiomes: Biomes
  tileSize: Size
  size: Size
  mapSource: string

  constructor(data: GameMapOptions) {
    Object.assign(this, data)

    this.absoluteBiomes = this.biomes.map(
      (biome) =>
        new BiomeOptions({
          ...biome,
          point: new Point(
            this.tileSize.width * biome.point.x,
            this.tileSize.height * biome.point.y,
          ),
          size: new Size(
            this.tileSize.width * biome.size.width,
            this.tileSize.height * biome.size.height,
          ),
        }),
    )
  }

  get absoluteSize() {
    return new Size(
      this.size.width * this.tileSize.width,
      this.size.height * this.tileSize.height,
    )
  }

  absoluteBiome(biomeName: MapAreaName): BiomeOptions | null {
    return this.absoluteBiomes.find((biome) => biome.name === biomeName)
  }

  biomeOf(hitbox: UniversalHitbox): MapAreaName[] {
    const biomes: MapAreaName[] = []
    for (let data of this.absoluteBiomes) {
      const points = rectToPolygon(data.point, data.size)
      if (universalWithin(hitbox, points)) biomes.push(data.name)
    }
    return biomes
  }
}
