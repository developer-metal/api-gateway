import mongoose from 'mongoose';

export type ObjectIdConstructor = {
  (str: string): mongoose.Types.ObjectId;
  new (str: string): mongoose.Types.ObjectId;
};

export const castinIdObject = (str: string) => {
return mongoose.Types.ObjectId.createFromHexString(str);
}

