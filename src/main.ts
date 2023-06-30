import { NestFactory } from '@nestjs/core'
import initTypes from 'datypes'
initTypes()
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { loadItems } from './before/loadItems'
import { loadMobs } from './before/loadMobs'
import { PORT, isDevelopment } from './constant'
import { loadAdminCommands } from './before/loadAdminCoomands'
import { NestExpressApplication } from '@nestjs/platform-express'
import config from 'config'
import { connectMongo } from './db/connect'
import { WsAdapter } from '@nestjs/platform-ws'
import connectDiscordBot from './apps/discord/discord-bot'
import helmet from 'helmet'
import { loadBios } from './before/loadBios'
import { json, urlencoded } from 'express'

async function bootstrap() {
  await Promise.all([
    loadItems(),
    loadBios(),
    loadMobs(),
    loadAdminCommands(),
    connectMongo(),
    connectDiscordBot(),
  ])

  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.useWebSocketAdapter(new WsAdapter(app))
  app.useGlobalPipes(new ValidationPipe())

  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  )

  app.use(json({ limit: '1mb' }))
  app.use(urlencoded({ limit: '1mb', extended: true }))

  app.enableCors({
    // origin: (origin, cb) => {
    //   const allowedOrigins = [config.get('WEB')]
    //   console.log(origin, allowedOrigins)
    //   if (!origin || allowedOrigins.indexOf(origin) === -1) {
    //     cb(new Error('Not allowed by CORS'))
    //   } else {
    //     cb(null, true)
    //   }
    // },
    origin: true,
    methods: ['GET', 'POST'],
    credentials: true,
  })
  await app.listen(+PORT)
}
bootstrap()
