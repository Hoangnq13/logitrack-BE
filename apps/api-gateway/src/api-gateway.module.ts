import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configValidationSchema } from '../../../libs/common/src/index';
import { DatabaseModule } from '../../../libs/database/src/index';
import { CommonModule } from '../../../libs/common/src/index';
import { FirebaseModule } from '../../../libs/firebase/src/index';

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
  ],
})
export class ApiGatewayModule { }
