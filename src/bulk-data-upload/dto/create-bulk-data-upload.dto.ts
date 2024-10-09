import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsIn } from 'class-validator';
export class CreateBulkDataUploadDto {
    @ApiProperty({description: 'product_slug', required: true })
    @IsNotEmpty({ message: 'El product_slug es requerido.' })
    @IsString({ message: 'El product_slug debe ser un string.' })
    product_slug: string;
    @ApiProperty({description: 'price', required: true })
    @IsNotEmpty({ message: 'El price es requerido.' })
    @IsString({ message: 'El price debe ser un string.' })
    price: string;
    @ApiProperty({description: 'currency', required: true })
    @IsNotEmpty({ message: 'El currency es requerido.' })
    @IsIn(['UF', 'CLP', 'PERCENTAGE'], { message: 'tipo de unidad - currency no permitido.' })
    currency: string;
    @ApiProperty({description: 'pill', required: true })
    @IsNotEmpty({ message: 'El pill es requerido.' })
    @IsString({ message: 'El pill debe ser un string.' })
    pill: string;
    @ApiProperty({description: 'price_description', required: true })
    @IsNotEmpty({ message: 'El price_description es requerido.' })
    @IsString({ message: 'El price_description debe ser un string.' })
    price_description: string;
    @ApiProperty({description: 'price_description', required: true })
    @IsNotEmpty({ message: 'El price_description es requerido.' })
    @IsIn(['INCLUDED', 'NONE', 'NOT_INCLUDED'], { message: 'tipo de unidad - IVA no permitido.' })
    iva: string;
    @ApiProperty({description: 'discount', required: true })
    @IsNotEmpty({ message: 'El discount es requerido.' })
    @IsString({ message: 'El discount debe ser un string.' })
    discount: string;
}