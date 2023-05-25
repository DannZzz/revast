import { Controller, Get } from '@nestjs/common'
import { SERVER_API } from 'src/constant'
import GameServers from 'src/servers/game-servers'

@Controller('api/servers')
export class ServersController {
  @Get()
  getServers() {
    const servers = GameServers.map((gameServer, apiPath) => ({
      name: gameServer.information.name,
      api: SERVER_API(apiPath),
      players: gameServer.alivePlayers.size,
    }))
    return servers
  }
}
