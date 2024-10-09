import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsEmail, IsNotEmpty, IsString, Matches, ValidateNested } from 'class-validator';

export class PrivilegesDto {
  @ApiProperty({ description: 'Nivel de Acceso', required: true})
  @IsNotEmpty({ message: 'Los accessLevel son requeridos.' })
  @IsString({ message: 'Los accessLevel deben ser un string.' })
  accessLevel: string;
  @ApiProperty({ description: 'Grupo Clave', required: true})
  @IsNotEmpty({ message: 'Los groupKey son requeridos.' })
  @IsString({ message: 'Los groupKey deben ser un string.' })
  groupKey: string;
} 
export class AuthRegisterUserDto {
  @ApiProperty({ description: 'Nombre Usuario', required: true})
  @IsNotEmpty({ message: 'El Nombre de usuario es requerido.' })
  @IsString({ message: 'El Nombre de usuario debe ser String.'})
  name: string;
  @ApiProperty({ description: 'Email usuario', required: true})
  @IsNotEmpty({ message: 'El email del contacto es requerido.' })
  @IsEmail()
  email: string;
  @ApiProperty({ description: 'Acceso General', required: true})
  @IsNotEmpty({ message: 'El acceso general es requerido.' })
  @IsString({ message: 'El acceso general debe ser String.'})
  access_general: string;
  @ApiProperty({ description: 'Privileges', required: true})
  @IsNotEmpty({ message: 'Los privilegios son requeridos.' })
  @ArrayNotEmpty({ message: 'Los privilegios no pueden estar vacios.' })
  @IsArray({ message: 'Los privilegios deben ser un arreglo.' })
  @ValidateNested({ each: true})
  @Type(() => PrivilegesDto)
  privileges: PrivilegesDto[];
  @ApiProperty({ description: 'clave usuario', required: true})
  @IsNotEmpty({ message: 'clave usuario es requerida.' })
  @IsString({ message: 'La clave debe ser String.'})
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$&+,:;=?@#|'<>.^*()%!-])[A-Za-z\d@$&+,:;=?@#|'<>.^*()%!-]{8,}$/,
    { message: 'clave invalida' }
  )
  password: string;
}