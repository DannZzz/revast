import { Module } from '@nestjs/common'
import { MainGateway } from './gateways/main.gateaway'

@Module({
  providers: [MainGateway],
  imports: [],
})
export class WsModule {}
