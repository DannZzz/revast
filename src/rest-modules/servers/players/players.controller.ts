import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import CameraViewQuery from 'src/structures/camera-view-query'

@Controller('api/players')
export class PlayersController {
  @Post('/canvas')
  view(@Body() body: { n: string; data: string }): void {
    if (!body || !('n' in body) || !('data' in body)) return
    const { n, data } = body
    if (!CameraViewQuery.has(n)) return
    CameraViewQuery.get(n)?.(data)
    CameraViewQuery.delete(n)
  }
}
