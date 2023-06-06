import { Module } from '@nestjs/common';
import { HighscoresController } from './highscores.controller';
import { HighscoresService } from './highscores.service';

@Module({
  controllers: [HighscoresController],
  providers: [HighscoresService]
})
export class HighscoresModule {}
