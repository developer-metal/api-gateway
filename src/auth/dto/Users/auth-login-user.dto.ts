import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class AuthLoginUserDto {
  @ApiProperty({ description: 'Email usuario', required: true})
  @IsNotEmpty({ message: 'El email del contacto es requerido.' })
  @IsEmail()
  email: string;
  @ApiProperty({ description: 'clave usuario', required: true})
  @IsNotEmpty({ message: 'clave usuario es requerida.' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$&+,:;=?@#|'<>.^*()%!-])[A-Za-z\d@$&+,:;=?@#|'<>.^*()%!-]{8,}$/,
    { message: 'clave invalida' }
  )
  password: string;
}