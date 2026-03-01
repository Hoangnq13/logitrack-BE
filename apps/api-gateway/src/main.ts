import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  app.enableCors({
    // Cho phép cổng 8080 (HTML test cũ) và 3001 (Next.js FE mới)
    origin: [
      'http://localhost:8080',
      'http://localhost:3001',
      'http://127.0.0.1:8080',
      'http://127.0.0.1:3001',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(process.env.port ?? 3000);
}
bootstrap();
