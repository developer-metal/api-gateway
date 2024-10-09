import { Prop, Schema, SchemaFactory  } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Profiles } from './Profiles.schema';
import { GroupProject } from './GroupProject.schema';
@Schema()
export class Privileges {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Profiles'})
  accessLevel: Profiles;
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'GroupProject'})
  groupKey: GroupProject;
}
export const PrivilegesSchema = SchemaFactory.createForClass(Privileges);