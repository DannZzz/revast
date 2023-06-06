import { Controller, Get, Param } from '@nestjs/common'
import { HighscoreModel } from 'src/db/models/highscore.schema'
import {
  HighscoreFilterDateOptions,
  HighscoreFilterTypeOptions,
  HighscoresService,
} from './highscores.service'
import { CacheTTL } from '@nestjs/cache-manager'

@Controller('api/users/highscores')
export class HighscoresController {
  constructor(private highscoresService: HighscoresService) {}

  @CacheTTL(30)
  @Get('/:date/:type')
  async findHighscoreMany(
    @Param('date') date: HighscoreFilterDateOptions,
    @Param('type') type: HighscoreFilterTypeOptions,
  ) {
    return (
      await this.highscoresService.findAllHighscores({
        beta: false,
        date,
        type,
      })
    ).map((model) => new HighscoreModel(model).toPlain())
  }

  @CacheTTL(30)
  @Get('/beta/:date/:type')
  async findHighscoreManyBeta(
    @Param('date') date: HighscoreFilterDateOptions,
    @Param('type') type: HighscoreFilterTypeOptions,
  ) {
    return (
      await this.highscoresService.findAllHighscores({ beta: true, date, type })
    ).map((model) => new HighscoreModel(model).toPlain())
  }
}
