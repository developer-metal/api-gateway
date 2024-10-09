import { Prop, Schema, SchemaFactory  } from '@nestjs/mongoose';
@Schema()
export class GroupProject {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true})
  projects: Array<any>;
  @Prop({ required: false })
  active: boolean;
  @Prop({ required: false })
  creationDate: string;
  @Prop({ required: false })
  updateDate: string;
}
export const GroupProjectSchema = SchemaFactory.createForClass(GroupProject);
GroupProjectSchema.index({ name: 1}, { unique: true});
GroupProjectSchema.index({ name: 'text' });
