import {
  Controller,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common'
import { SkipThrottle } from '@nestjs/throttler'
import { Items } from 'src/data/items'
import { ItemCompactEntity } from 'src/entities/item.entity'
import { Transformer } from 'src/structures/Transformer'

// @SkipThrottle()
@Controller('api/crafts')
export class CraftsController {
  @Get('/list')
  getCraftList() {
    const craftables = Items.filter((item) => !!item.data.craftable).map(
      (item) => ({
        state: item.data.craftable.state || {},
        items: item.data.craftable.required || {},
      }),
    )

    return craftables
  }

  @Get('/items')
  getItem() {
    return Items.map((item) =>
      Transformer.toPlain(new ItemCompactEntity(item.data)),
    )
  }
}
