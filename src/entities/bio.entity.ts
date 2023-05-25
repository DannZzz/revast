import { Point, Size } from 'src/global/global'
import {
  Bio,
  BioItemProps,
  PolygonPosition,
  RectPosition,
  ResourceTypes,
} from '../game/basic/bio-item.basic'
import { Exclude, Expose } from 'class-transformer'
import { AssetLink } from 'src/structures/Transformer'

@Exclude()
export class BioEntity implements BioItemProps {
  @Expose()
  point: Point

  mapId: number
  @Expose()
  type: ResourceTypes

  resources: number

  validPosition: RectPosition | PolygonPosition

  @Expose()
  maxResources?: number

  @Expose()
  currentResources?: number

  @Expose()
  size: Size

  getWithEverything?: true

  @Expose()
  source: string

  rechargeAmount: number

  @Expose()
  id: string

  @AssetLink()
  @Expose()
  get url() {
    return this.source
  }

  constructor(data: any) {
    if (data.onResourcesChangeDrawEvent) {
      this.maxResources = data.resources
      this.currentResources = data._currentResources
    }
    Object.assign(this, data)
  }
  givesXp: number
  onResourcesChangeDrawEvent?: boolean
}
