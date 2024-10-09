import { Prop, Schema, SchemaFactory  } from '@nestjs/mongoose';
import { Privileges } from './Privileges.schema';
import mongoose from 'mongoose';
import { Profiles } from './Profiles.schema';
@Schema()
export class Users {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true})
  email: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Profiles'})
  access_general: Profiles;
  @Prop({ required: true })
  privileges: Privileges[];
  @Prop({ required: false })
  active: boolean;
  @Prop({ required: false })
  creationDate: string;
  @Prop({ required: false })
  updateDate: string;
}
export const UsersLocalsSchema = SchemaFactory.createForClass(Users);
UsersLocalsSchema.index({ email: 1}, { unique: true});
UsersLocalsSchema.index({ email: 'text' });