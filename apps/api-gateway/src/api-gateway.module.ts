import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configValidationSchema } from '@logitrack/common';
import { DatabaseModule } from '@logitrack/database';
import { CommonModule } from '@logitrack/common';
import { FirebaseModule } from '@logitrack/firebase';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: configValidationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
    DatabaseModule,
    CommonModule,
    FirebaseModule,
    AuthModule,
  ],
})
export class ApiGatewayModule { }
