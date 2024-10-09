import { Prop, Schema, SchemaFactory  } from '@nestjs/mongoose';
@Schema()
export class BuldataUpload {
  @Prop({ required: false })
  active: boolean;
  @Prop({ required: true })
  product_slug: string;
  @Prop({ required: true })
  price: string;
  @Prop({ required: true })
  currency: string;
  @Prop({ required: true })
  pill: string;
  @Prop({ required: true })
  price_description: string;
  @Prop({ required: true })
  iva: string;
  @Prop({ required: true })
  discount: string;
  @Prop({ required: false })
  creation_date: string;
  @Prop({ required: false })
  update_date: string;
}
export const BuldataUploadSchema = SchemaFactory.createForClass(BuldataUpload);