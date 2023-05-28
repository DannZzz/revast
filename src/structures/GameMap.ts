import { Point, Size } from 'src/global/global'
import { Exclude } from 'class-transformer'
import { UniversalHitbox, universalWithin } from 'src/utils/universal-within'
import { rectToPolygon } from 'src/utils/polygons'
import { StaticItems } from './StaticItems'

export class BiomeEffect {
  speed: number = 0
  hungry: number = 0
  temperatureDay: number = 0
  temperatureNight: number = 0
  vast: number = 0

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
  | 'lake1'

export class BiomeOptions {
  @Exclude()
  name: MapAreaName
  @Exclude()
  type: Biome
  @Exclude()
  priority?: number = 1
  size: Size
  point: Point
  bgColor: string
  borderColor?: string
  @Exclude()
  effect: BiomeEffect
  @Exclude()
  digItemId?: number

  constructor(data: BiomeOptions) {
    Object.assign(this, data)
  }
}

export type AreaStaticItems = { [k in MapAreaName]?: StaticItems }

export enum Biome {
  forest,
  winter,
  beach,
  water,
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

  find(areas: MapAreaName[]): BiomeOptions
  find(biomes: Biome[]): BiomeOptions
  find(args: Array<Biome | MapAreaName>): BiomeOptions {
    for (let arg of args) {
      if (typeof arg === 'string') {
        const option = this.absoluteBiomes.find((biome) => biome.name === arg)
        if (option) return option
      } else {
        const option = this.absoluteBiomes.find((biome) => biome.type === arg)
        if (option) return option
      }
    }

    return null
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

  areaOf(hitbox: UniversalHitbox): MapAreaName[] {
    const biomes: BiomeOptions[] = []
    for (let data of this.absoluteBiomes) {
      const points = rectToPolygon(data.point, data.size)
      if (universalWithin(hitbox, points)) biomes.push(data)
    }
    return biomes.sort((a, b) => b.priority - a.priority).map((b) => b.name)
  }

  biomeOf(hitbox: UniversalHitbox): Biome[] {
    const biomes: BiomeOptions[] = []
    for (let data of this.absoluteBiomes) {
      const points = rectToPolygon(data.point, data.size)
      if (universalWithin(hitbox, points)) biomes.push(data)
    }
    return biomes.sort((a, b) => b.priority - a.priority).map((b) => b.type)
  }
}
