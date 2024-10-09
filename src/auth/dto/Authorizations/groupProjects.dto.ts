import { ApiProperty, IntersectionType, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString, Matches, ValidateNested } from 'class-validator';

export class GroupProjectsDto {
  @ApiProperty({ description: 'Nombre Grupo', required: true})
  @IsNotEmpty({ message: 'El Nombre del grupo es requerido.' })
  @IsString({ message: 'El Nombre del grupo debe ser String.'})
  name: string;
  @ApiProperty({ description: 'Projectos', required: true})
  @IsArray({ message: 'propiedad projects debe ser un Array.' })
  @ArrayNotEmpty({ message: 'informacion requerida.' })
  projects: Array<any>;
}



