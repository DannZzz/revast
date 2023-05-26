import { boxPoint } from 'intersects'
import { Point, Size } from 'src/global/global'
import { Converter } from './Converter'
import { Exclude } from 'class-transformer'

export class BiomeEffect {
  speed: number = 0
  hungry: number = 0
  temperatureDay: number = 0
  temperatureNight: number = 0

  constructor(data: Partial<BiomeEffect> = {}) {
    Object.assign(this, data)
  }
}

export class BiomeOptions {
  @Exclude()
  name: string
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
  tileSize: Size
  size: Size
  mapSource: string

  constructor(data: GameMapOptions) {
    Object.assign(this, data)
  }

  get absoluteSize() {
    return new Size(
      this.size.width * this.tileSize.width,
      this.size.height * this.tileSize.height,
    )
  }

  absoluteBiome(biomeName: string): BiomeOptions | null {
    const biome = this.biomes.find((bo) => bo.name === biomeName)
    if (biome) {
      const { bgColor, borderColor, point, size, effect } = biome
      return {
        name: biomeName,
        type: biome.type,
        bgColor,
        borderColor,
        priority: biome.priority,
        point: new Point(
          this.tileSize.width * point.x,
          this.tileSize.height * point.y,
        ),
        size: new Size(
          this.tileSize.width * size.width,
          this.tileSize.height * size.height,
        ),
        effect: effect,
      }
    } else {
      return null
    }
  }

  biomeOf(point: Point): string {
    for (let biome of this.biomes) {
      const data = this.absoluteBiome(biome.name)
      if (
        boxPoint(
          ...Converter.pointToXYArray(data.point),
          data.size.width,
          data.size.height,
          ...Converter.pointToXYArray(point),
        )
      )
        return data.name
    }
    return 'forest'
  }
}
