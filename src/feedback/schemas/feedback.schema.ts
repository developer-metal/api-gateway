import { Prop, Schema, SchemaFactory  } from '@nestjs/mongoose';
@Schema()
export class Feedback {
  @Prop({ required: false })
  token_user: string;
  @Prop({ required: false })
  active: boolean;
  @Prop({ required: true })
  product_service: string;
  @Prop({ required: true })
  flag: boolean;
  @Prop({ required: true })
  message: string;
  @Prop({ required: false })
  browser_client: string;
  @Prop({ required: false })
  creation_date: string;
  @Prop({ required: false })
  update_date: string;
}
export const FeedbackSchema = SchemaFactory.createForClass(Feedback);