import { Controller, Get } from '@nestjs/common'
import { SkipThrottle } from '@nestjs/throttler'
import { SERVER_API } from 'src/constant'
import GameServers from 'src/servers/game-servers'

// @SkipThrottle()
@Controller('api/servers')
export class ServersController {
  @Get()
  getServers() {
    const servers = GameServers.map((gameServer, apiPath) => ({
      name: gameServer.information.name,
      api: SERVER_API(apiPath, true),
      players: gameServer.alivePlayers.size,
    }))
    return servers
  }
}
