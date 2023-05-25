import { Exclude, Expose } from 'class-transformer'
import { Point, Size } from 'src/global/global'
import { AssetLink } from 'src/structures/Transformer'

@Exclude()
export class DropEntity {
  @AssetLink()
  @Expose({ name: 'url' })
  source: string

  @AssetLink()
  @Expose({ name: 'hurtUrl' })
  hurtSource: string

  @Expose()
  size: Size

  @Expose()
  point: Point

  @Expose()
  id: string

  constructor(data: Partial<DropEntity>) {
    Object.assign(this, data)
  }
}
