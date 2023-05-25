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
import { join } from 'path'
import config from 'config'

async function bootstrap() {
  await Promise.all([loadItems(), loadMobs(), loadAdminCommands()])
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: { origin: config.get('WEB') },
  })
  if (config.util.getEnv('NODE_ENV') === 'production')
    app.useStaticAssets(join(__dirname, '..', 'client', 'dist'))
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(+PORT)
}
bootstrap()
