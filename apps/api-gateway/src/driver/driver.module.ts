import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DriverController } from './driver.controller';
import { DriverService } from './driver.service';
import { DriverLocationService } from './driver-location.service';
import { Driver, DriverSchema } from './schemas/driver.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Driver.name, schema: DriverSchema }]),
    AuthModule,
  ],
  controllers: [DriverController],
  providers: [DriverService, DriverLocationService],
})
export class DriverModule {}
