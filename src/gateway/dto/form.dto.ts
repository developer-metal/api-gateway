import {
  ApiProperty,
  ApiPropertyOptional
} from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsArray,
  IsDate,
  ValidateNested,
  ArrayNotEmpty,
  IsOptional,
  IsObject,
  IsIn
} from 'class-validator';
import { SanitizeHtml } from '../validators/sanitizeHtml.constraint';

export class AttachedData {
  @ApiPropertyOptional({ description: 'filename adjunto', required: false })
  @IsOptional()
  @IsNotEmpty({ message: 'filename es requerido.' })
  @IsString({ message: 'filename debe ser un string.' })
  filename: string;
  @ApiPropertyOptional({ description: 'typefile adjunto', required: false })
  @IsOptional()
  @IsNotEmpty({ message: 'typefile es requerido.' })
  @IsString({ message: 'typefile debe ser un string.' })
  @IsIn(['pdf', 'csv', 'zip'], { message: 'tipo de archivo no permitido.' })
  typefile: string;
  @ApiPropertyOptional({ description: 'filecontent adjunto', required: false })
  @IsOptional()
  @IsNotEmpty({ message: 'filecontent es requerido.' })
  @IsString({ message: 'filecontent debe ser un string.' })
  filecontent: string;
  @ApiPropertyOptional({ description: 'encoding adjunto', required: false })
  @IsOptional()
  @IsNotEmpty({ message: 'encoding es requerido.' })
  @IsString({ message: 'encoding debe ser un string.' })
  @IsIn(['base64'], { message: 'tipo de codificacion no permitido.' })
  encoding: string;
}
export class FileContent {
  @ApiProperty({ description: 'statement enviado formulario', required: true })
  @IsNotEmpty({ message: 'statement es requerido.' })
  @IsString({ message: 'statement debe ser un string.' })
  statement: string;
  @ApiProperty({ description: 'response de formulario', required: true })
  @IsNotEmpty({ message: 'response es requerido.' })
  @IsString({ message: 'response debe ser un string.' })
  response: string;
}
export class FormField {
  @ApiProperty({ description: 'Identificacion de reporte', required: true })
  @IsOptional({ message: 'El reportIdentification es opcional.' })
  @IsNotEmpty({ message: 'El reportIdentification es requerido.' })
  @IsString({ message: 'El reportIdentification debe ser un string.' })
  @SanitizeHtml({ message: 'HTML no permitido.'})
  reportIdentification: string;
  @ApiProperty({ description: 'fieldsContainer', required: true })
  @IsArray({ message: 'El fieldsContainer deben ser un array.' })
  @ValidateNested({ each: true })
  @ArrayNotEmpty({ message: 'fieldsContainer es requerido.' })
  @Type(() => FileContent)
  fieldsContainer: FileContent[];
}
export class FormRequest {
  @ApiProperty({
    description: 'Nombre del contacto',
    example: 'Juan',
    required: true
  })
  @IsNotEmpty({ message: 'El nombre del contacto es requerido.' })
  @IsString({ message: 'El nombre del contacto debe ser un string.' })
  @SanitizeHtml({ message: 'HTML no permitido.'})
  contactName: string;
  @ApiProperty({
    description: 'Apellido del contacto',
    example: 'Perez',
    required: true
  })
  @IsOptional()
  @IsNotEmpty({ message: 'El apellido del contacto es requerido.' })
  @IsString({ message: 'El apellido del contacto debe ser un string.' })
  @SanitizeHtml({ message: 'HTML no permitido.'})
  readonly contactLastName: string;
  @ApiProperty({
    description: 'Email del contacto',
    example: 'info@gmail.com',
    required: true
  })
  @IsNotEmpty({ message: 'El email del contacto es requerido.' })
  @IsEmail({}, { message: 'El email del contacto debe ser un email válido.' })
  @SanitizeHtml({ message: 'HTML no permitido.'})
  readonly contactEmail: string;
  @ApiProperty({ description: 'projecto', example: 'PORI', required: true })
  @IsNotEmpty({ message: 'El proyecto es requerido.' })
  @IsString({ message: 'El proyecto debe ser un string.' })
  @SanitizeHtml({ message: 'HTML no permitido.'})
  readonly projectSlug: string;
  @ApiProperty({ description: 'Campo fields', required: true })
  @IsNotEmpty({ message: 'campo fields es requerido.' })
  @IsObject({ message: 'fields debe ser un objecto.' })
  @ValidateNested({ each: true })
  @Type(() => FormField)
  fields: FormField;
  @ApiPropertyOptional({ description: 'Archivos adjuntos', required: true })
  @IsOptional()
  @IsArray({ message: 'Archivos adjuntos deben ser un array.' })
  @ValidateNested({ each: true })
  @ArrayNotEmpty({ message: 'Los archivos adjuntos son requeridos.' })
  @Type(() => AttachedData)
  blobs: AttachedData[];
}

export class RetrieveForm {
  @ApiPropertyOptional({
    description: 'Nombre del slug Proyecto',
    example: 'PORI',
    required: false
  })
  @IsNotEmpty({ message: 'Nombre del slug Proyecto es requerido.' })
  @IsString({ message: 'Nombre del slug Proyecto ser un string.' })
  @IsOptional({ message: 'Nombre del slug Proyecto es opcional.' })
  @SanitizeHtml({ message: 'HTML no permitido.'})
  readonly projectSlug: string; // marca
  @ApiPropertyOptional({
    description: 'Nombre del Contacto',
    example: 'HERMES',
    required: false
  })
  @IsNotEmpty({ message: 'El nombre del Contacto es requerido.' })
  @IsString({ message: 'El nombre del Contacto debe ser un string.' })
  @IsOptional({ message: 'El nombre del Contacto es opcional.' })
  @SanitizeHtml({ message: 'HTML no permitido.'})
  readonly contactName: string;
  @ApiPropertyOptional({
    description: 'Email del contacto',
    example: 'info@gmail.com',
    required: false
  })
  @IsNotEmpty({ message: 'El email del contacto es requerido.' })
  @IsEmail({}, { message: 'El email del contacto debe ser un email válido.' })
  @IsOptional({ message: 'El email del Contacto es opcional.' })
  @SanitizeHtml({ message: 'HTML no permitido.'})
  readonly contactEmail: string;
  @ApiProperty({ description: 'Fecha de inicio', required: true })
  @IsNotEmpty({ message: 'La Fecha de inicio es requerida.' })
  @IsDate({ message: 'La Fecha de inicio debe ser una fecha.' })
  @Type(() => Date)
  @IsOptional({ message: 'Fecha de inicio es opcional.' })
  @SanitizeHtml({ message: 'HTML no permitido.'})
  readonly startDate: Date;
  @ApiProperty({ description: 'Fecha de fin', required: true })
  @IsNotEmpty({ message: 'La Fecha de fin es requerida.' })
  @IsDate({ message: 'La Fecha de fin debe ser una fecha.' })
  @Type(() => Date)
  @IsOptional({ message: 'Fecha de fin es opcional.' })
  @SanitizeHtml({ message: 'HTML no permitido.'})
  readonly endDate: Date;
}

export class AllForm {
  @ApiPropertyOptional({ description: 'Nombre del Contacto', required: false})
  @IsOptional({ message: 'El Contacto es opcional.' })
  @SanitizeHtml({ message: 'HTML no permitido.'})
  contactName: string;
  @ApiPropertyOptional({ description: 'Email del Contacto', required: false})
  @IsOptional({ message: 'El Email es opcional.' })
  @SanitizeHtml({ message: 'HTML no permitido.'})
  contactEmail: string;
  @ApiPropertyOptional({ description: 'Proyecto', required: false})
  @IsOptional({ message: 'El nombre de proyecto es opcional.' })
  @SanitizeHtml({ message: 'HTML no permitido.'})
  projectSlug: string;
  @ApiPropertyOptional({ description: 'Fecha Inicio', required: false})
  @IsOptional({ message: 'Fecha Inicio Opcional.' })
  @SanitizeHtml({ message: 'HTML no permitido.'})
  startDate: string;
  @ApiPropertyOptional({ description: 'Fecha Fin', required: false})
  @IsOptional({ message: 'Fecha Fin Opcional.' })
  @SanitizeHtml({ message: 'HTML no permitido.'})
  endDate: string;
  @ApiPropertyOptional({ description: 'Flag Envio wellcome', required: false})
  @IsOptional({ message: 'Flag wellcome Opcional.' })
  @Transform(({obj, key}) => {
    return obj[key] === 'true' ? true : obj[key] === 'false' ? false : obj[key];
  })
  thanksSent: boolean;
  @ApiPropertyOptional({ description: 'Flag Envio Questions', required: false})
  @IsOptional({ message: 'Flag Questions Opcional.' })
  @Transform(({obj, key}) => {
    return obj[key] === 'true' ? true : obj[key] === 'false' ? false : obj[key];
  })
  interestedSent: boolean;
  @ApiPropertyOptional({ description: 'Flag reintento Template Wellcome', required: false})
  @IsOptional({ message: 'Flag reintento Template Wellcome Opcional.' })
  @Type(() => Number)
  countSendWellcome: number;
  @ApiPropertyOptional({ description: 'Flag reintento Template Questions', required: false})
  @IsOptional({ message: 'Flag reintento Template Questions.' })
  @Type(() => Number)
  countSendinterested: number;
}
export class ValidationForm {
  @ApiProperty({ description: 'slug', required: true })
  @IsNotEmpty({ message: 'slug es requerido.' })
  @IsString({ message: 'slug debe ser un string.' })
  slug: string;
}
export class SavedForm {
  form: FormRequest;
  thanksSent: boolean;
  interestedSent: boolean;
}