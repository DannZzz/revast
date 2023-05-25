import { NestFactory } from '@nestjs/core'
import initTypes from 'datypes'
initTypes()
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { loadItems } from './before/loadItems'
import { loadMobs } from './before/loadMobs'
import { PORT } from './constant'
import { loadAdminCommands } from './before/loadAdminCoomands'

async function bootstrap() {
  await Promise.all([loadItems(), loadMobs(), loadAdminCommands()])
  const app = await NestFactory.create(AppModule, {
    cors: { origin: 'http://localhost:3000' },
  })
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(PORT)
}
bootstrap()
