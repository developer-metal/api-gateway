import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';
export class CreateFeedbackDto {
@ApiProperty({description: 'producto o servicio', required: true })
@IsNotEmpty({ message: 'El product_service del contacto es requerido.' })
@IsString({ message: 'El product_service del contacto debe ser un string.' })
product_service: string;
@ApiProperty({description: 'flag_feedback', required: true })
@IsNotEmpty({ message: 'El flag_feedback del contacto es requerido.' })
@IsBoolean({ message: 'El flag_feedback del contacto debe ser un boolean.' })
flag: boolean;
@ApiProperty({description: 'message', required: true })
@IsNotEmpty({ message: 'El message del contacto es requerido.' })
@IsString({ message: 'El message del contacto debe ser un string.' })
message: string;
@ApiPropertyOptional({description: 'browser_client', required: false })
@IsOptional({ message: 'browser_client Optional' })
@IsNotEmpty({ message: 'El browser_client del contacto es requerido.' })
@IsString({ message: 'El browser_client del contacto debe ser un string.' })
browser_client: string;
@ApiProperty({description: 'token_user', required: true })
@IsNotEmpty({ message: 'El token_user del contacto es requerido.' })
@IsString({ message: 'El token_user del contacto debe ser un string.' })
token_user: string;
}