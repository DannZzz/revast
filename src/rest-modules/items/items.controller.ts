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
  getSkins(@Req() req: Request) {
    let ip = Array.isArray(req.headers['x-forwarded-for'])
      ? req.headers['x-forwarded-for'][0]
      : req.headers['x-forwarded-for']
    ip = ip?.split?.(', ')?.[0]
    console.log('from skin ip', ip)
    if (ip) {
      if (CollectedIps.has(ip)) {
        CollectedIps.get(ip).createdAt = Date.now()
      } else if (typeof ip === 'string') {
        CollectedIps.set(ip, {
          createdAt: Date.now(),
          connections: 0,
          lastConnection: 0,
        })
      }
    }
    return PlayerSkins.map((skin) => new PlayerSkinEntity(skin))
  }
}
