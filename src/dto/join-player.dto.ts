import { IsNotEmpty, IsObject, IsString, ValidateNested } from 'class-validator'
import { PlayerSettings, PlayerSkinName } from 'src/game/types/player.types'
import { Size } from 'src/global/global'

export class JoinPlayerDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  screen: Size

  @IsString()
  token?: string

  @IsString()
  recaptcha_token: string

  settings: PlayerSettings

  skin: number
}
