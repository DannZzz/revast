import { Exclude, Expose } from 'class-transformer'
import { AssetLink } from 'src/structures/Transformer'

@Exclude()
export class CraftEntity {
  @AssetLink()
  @Expose({ name: 'iconUrl' })
  iconSource: string

  @Expose()
  id: string

  @Expose()
  craftDuration: number

  constructor(data: CraftEntity) {
    Object.assign(this, data)
  }
}
