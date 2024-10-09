import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsEmail, IsNumber, Min, Max } from 'class-validator';
export class CreateSatisfactionSurveyDto {
@ApiProperty({ description: 'nivel de satisfaccion', required: true })
@IsNumber({}, { message: 'El nivel de satisfacción debe ser un número.' })
@IsNotEmpty({ message: 'El nivel de satisfacción es requerido.' })
@Min(1, { message: 'El nivel de satisfacción debe ser mayor a 0.' })
@Max(5, { message: 'El nivel de satisfacción debe ser menor a 6.' })
level: number;
@ApiProperty({ description: 'nombre contacto form', required: true })
@IsString({ message: 'El nombre del contacto debe ser un string.' })
@IsNotEmpty({ message: 'El nombre del contacto es requerido.' })
name: string;
@ApiProperty({ description: 'email del contacto', required: true })
@IsEmail({}, { message: 'El email del contacto debe ser un email válido.' })
@IsNotEmpty({ message: 'El email del contacto es requerido.' })
email: string;
@ApiProperty({ description: 'name Projecto', required: true })
@IsString({ message: 'El nombre del proyecto debe ser un string.' })
@IsNotEmpty({ message: 'El nombre del proyecto es requerido.' })
project: string;
}