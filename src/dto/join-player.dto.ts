import { IsNotEmpty, IsObject, IsString, ValidateNested } from 'class-validator'
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
}
