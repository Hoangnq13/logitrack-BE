import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  // Cho phép Frontend ở cổng HTTP khác (như 8080) gọi được vào API Gateway (cổng 3000)
  app.enableCors();

  await app.listen(process.env.port ?? 3000);
}
bootstrap();
