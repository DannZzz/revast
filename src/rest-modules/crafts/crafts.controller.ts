import {
  Controller,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common'
import { SkipThrottle } from '@nestjs/throttler'
import { Items } from 'src/data/items'
import { ItemCompactEntity } from 'src/entities/item.entity'
import { Craft } from 'src/structures/Craft'
import { Transformer } from 'src/structures/Transformer'

// @SkipThrottle()
@Controller('api/crafts')
export class CraftsController {
  @Get('/list')
  getCraftList() {
    const craftables = Craft.data.map((item) => {
      return {
        id: item.id,
        state: item.craftable.state || {},
        items: item.craftable.required || {},
      }
    })

    return craftables
  }

  @Get('/items')
  getItem() {
    return Items.map((item) =>
      Transformer.toPlain(new ItemCompactEntity(item.data)),
    )
  }
}
