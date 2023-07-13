import { Point, Size } from 'src/global/global'
import { Exclude, Expose, Transform } from 'class-transformer'
import { UniversalHitbox, universalWithin } from 'src/utils/universal-within'
import { rectToPolygon } from 'src/utils/polygons'
import { StaticItems } from './StaticItems'
import { pointBox, pointPolygon } from 'intersects'
import { Converter } from './Converter'

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
  | 'big-island-cave'
  | 'winter'
  | 'desert'
  | 'beach'
  | 'forest'
  | 'ocean'
  | `lake${number}`
  | `island${number}`

@Exclude()
export class BiomeOptions {
  @Expose()
  size?: Size
  @Expose()
  point?: Point
  @Expose()
  points?: Point[]
  @Expose()
  bgColor?: string
  @Expose()
  borderColor?: string

  notDrawAble?: boolean
  effect: BiomeEffect
  digItemId?: number
  onBridgeEffect?: BiomeEffect
  absoluteSize?: boolean
  name: MapAreaName
  type: Biome
  priority?: number = 1

  constructor(data: BiomeOptions) {
    Object.assign(this, data)
    this.onBridgeEffect = new BiomeEffect({
      ...this.effect,
      ...(this.onBridgeEffect || {}),
    })
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
  absoluteBiomes: Biomes
  tileSize: Size
  size: Size
  mapSource: string

  constructor(data: GameMapOptions) {
    Object.assign(this, data)

    this.loadAbsoluteBiomes()
  }

  withinMap(hitbox: UniversalHitbox): boolean {
    return universalWithin(hitbox, {
      point: new Point(0, 0),
      size: new Size(
        this.tileSize.width * this.size.width,
        this.tileSize.height * this.size.height,
      ),
    })
  }

  private loadAbsoluteBiomes() {
    this.absoluteBiomes = this.biomes.map(
      (biome) =>
        new BiomeOptions({
          ...biome,
          ...(biome.points
            ? biome.absoluteSize
              ? biome.points
              : {
                  points: biome.points.map(
                    (point) =>
                      new Point(
                        this.tileSize.width * point.x,
                        this.tileSize.height * point.y,
                      ),
                  ),
                }
            : biome.absoluteSize
            ? { point: biome.point, size: biome.size }
            : {
                point: new Point(
                  this.tileSize.width * biome.point.x,
                  this.tileSize.height * biome.point.y,
                ),
                size: new Size(
                  this.tileSize.width * biome.size.width,
                  this.tileSize.height * biome.size.height,
                ),
              }),
        }),
    )
  }

  addBiome(...biomes: BiomeOptions[]) {
    this.biomes.push(...biomes)
    this.loadAbsoluteBiomes()
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
      if (
        universalWithin(
          hitbox,
          data.points ? data.points : { point: data.point, size: data.size },
        )
      )
        biomes.push(data)
    }
    return biomes.sort((a, b) => b.priority - a.priority).map((b) => b.name)
  }

  biomeOf(hitbox: Point, a?: boolean): Biome[] {
    const biomes: BiomeOptions[] = []
    for (let data of this.absoluteBiomes) {
      if (
        universalWithin(
          hitbox,
          data.points ? data.points : { point: data.point, size: data.size },
        )
      ) {
        biomes.push(data)
      }
    }
    return biomes.sort((a, b) => b.priority - a.priority).map((b) => b.type)
  }
}
