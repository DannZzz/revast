import { Expose } from 'class-transformer'
import { ActionableSettableDrawOptions } from 'src/game/extended/settable/actionable.basic'
import { Point, Size } from 'src/global/global'
import { AssetLink } from 'src/structures/Transformer'
import { ImageSource } from 'src/structures/image-base'

export class ActionableSettableDrawOptionsEntity
  implements ActionableSettableDrawOptions
{
  @AssetLink()
  @Expose({ name: 'backgroundUrl' })
  backgroundSource: string
  size: Size
  offset?: Point

  constructor(data: ActionableSettableDrawOptionsEntity) {
    Object.assign(this, data)
  }
}
