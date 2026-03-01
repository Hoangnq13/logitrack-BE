import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../enums/role.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, index: true })
  firebaseUid: string;

  @Prop()
  email?: string;

  @Prop()
  phoneNumber?: string;

  @Prop({ type: [String], enum: Role, default: [Role.CUSTOMER] })
  roles: Role[];

  @Prop()
  fullName?: string;

  @Prop()
  avatarUrl?: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
