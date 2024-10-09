import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ description: 'Nombre Usuario', required: true})
  @IsNotEmpty({ message: 'El Nombre de usuario es requerido.' })
  @IsString({ message: 'El Nombre de usuario debe ser String.'})
  username: string;
  @ApiProperty({ description: 'code confirmacion registro Usuario', required: true})
  @IsNotEmpty({ message: 'El code de confirmacion es requerido.' })
  @IsString({ message: 'El code de confirmacion debe ser String.'})
  verificationCode?: string;
  @ApiProperty({ description: 'code confirmacion registro Usuario', required: true})
  @IsNotEmpty({ message: 'code confirmacion es requerido.' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$&+,:;=?@#|'<>.^*()%!-])[A-Za-z\d@$&+,:;=?@#|'<>.^*()%!-]{8,}$/,
    { message: 'clave invalida' }
  )
  password?: string;
}