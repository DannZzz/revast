import { NestFactory } from '@nestjs/core'
import initTypes from 'datypes'
initTypes()
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { loadItems } from './before/loadItems'
import { loadMobs } from './before/loadMobs'
import { PORT } from './constant'
import { loadAdminCommands } from './before/loadAdminCoomands'
import { NestExpressApplication } from '@nestjs/platform-express'
import config from 'config'
import { connectMongo } from './db/connect'
import { WsAdapter } from '@nestjs/platform-ws'
import connectDiscordBot from './apps/discord/discord-bot'

async function bootstrap() {
  await Promise.all([
    connectMongo(),
    loadItems(),
    loadMobs(),
    loadAdminCommands(),
    connectDiscordBot(),
  ])

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: process.env.NODE_ENV === 'production' ? config.get('WEB') : '*',
    },
  })

  console.log(
    'origin_cors',
    process.env.NODE_ENV === 'production' ? config.get('WEB') : '*',
    config.util.getEnv('NODE_ENV'),
  )
  app.useWebSocketAdapter(new WsAdapter(app))
  app.useGlobalPipes(new ValidationPipe())
  app.enableCors()
  await app.listen(+PORT)
}
bootstrap()
