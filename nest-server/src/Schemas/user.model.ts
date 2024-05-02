import { HydratedDocument } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop({ required: true, unique: true })
  login: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    default:
      'https://i.pinimg.com/236x/df/b9/48/dfb9480c1ae5b4948a37e16f1df23297.jpg',
  })
  image: string;

  @Prop()
  publicKey: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
