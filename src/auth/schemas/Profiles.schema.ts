import { Prop, Schema, SchemaFactory  } from '@nestjs/mongoose';
@Schema()
export class Profiles {
  @Prop({ required: true })
  name: string;
  @Prop({ required: false })
  active: boolean;
  @Prop({ required: false })
  creationDate: string;
  @Prop({ required: false })
  updateDate: string;
}
export const ProfilesSchema = SchemaFactory.createForClass(Profiles);
ProfilesSchema.index({ name: 1 }, { unique: true});
ProfilesSchema.index({ name: 'text' });