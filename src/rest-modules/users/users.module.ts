import { Module } from '@nestjs/common'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { HighscoresModule } from './highscores/highscores.module';

@Module({
  imports: [HighscoresModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
