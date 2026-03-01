import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../auth/schemas/user.schema';

export type DriverDocument = Driver & Document;

export enum DriverStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  IN_RIDE = 'IN_RIDE',
}

@Schema({ _id: false })
export class Vehicle {
  @Prop({ required: true })
  plateNumber: string;

  @Prop({ required: true })
  model: string;

  @Prop()
  color: string;

  @Prop({ default: 'TRUCK' })
  type: string;
}
export const VehicleSchema = SchemaFactory.createForClass(Vehicle);

@Schema({ _id: false })
export class DriverStats {
  @Prop({ default: 0 })
  totalTrips: number;

  @Prop({ default: 5.0 })
  rating: number;

  @Prop({ default: 0 })
  canceledTrips: number;
}
export const DriverStatsSchema = SchemaFactory.createForClass(DriverStats);

@Schema({ timestamps: true })
export class Driver {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  user: User;

  @Prop({ type: VehicleSchema, required: true })
  vehicle: Vehicle;

  @Prop({ type: String, enum: DriverStatus, default: DriverStatus.OFFLINE })
  status: DriverStatus;

  @Prop({ type: Boolean, default: false })
  isAvailable: boolean;

  @Prop({ type: DriverStatsSchema, default: () => ({}) })
  stats: DriverStats;
}

export const DriverSchema = SchemaFactory.createForClass(Driver);
