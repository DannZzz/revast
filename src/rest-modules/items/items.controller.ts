import { Controller, Get, Res } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { Items } from 'src/data/items'

@Controller('api/items')
export class ItemsController {
  @Throttle(20, 10)
  @Get('/names')
  getNames() {
    return Items.map((item) => [item.id, item.data.name])
  }
}
