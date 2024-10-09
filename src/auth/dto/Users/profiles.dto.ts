import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class ProfilesDto {
  @ApiProperty({ description: 'Profiles', required: true})
  @IsNotEmpty({ message: 'El nombre es requerido.' })
  name: string;
}