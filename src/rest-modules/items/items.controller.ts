import {
  Controller,
  Get,
  Req,
  Res,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
  Ip,
} from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { Items } from 'src/data/items'
import { PlayerSkins } from 'src/data/skins'
import { PlayerSkinEntity } from 'src/entities/player-skin.entity'
import CollectedIps from 'src/utils/collected-ips'

@Controller('api/items')
export class ItemsController {
  // @Throttle(20, 10)
  @Get('/names')
  getNames() {
    return Items.map((item) => [item.id, item.data.name])
  }

  @Get('/skins')
  @UseInterceptors(ClassSerializerInterceptor)
  getSkins(@Ip() ip: string) {
    console.log('skin', ip)
    if (CollectedIps.has(ip)) {
      CollectedIps.get(ip).createdAt = Date.now()
    } else {
      CollectedIps.set(ip, { createdAt: Date.now() })
    }
    return PlayerSkins.map((skin) => new PlayerSkinEntity(skin))
  }
}
