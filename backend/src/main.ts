import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Налаштування CORS для дозволу запитів з фронтенду
  app.enableCors({
    origin: true, // Дозволяємо всі origins в development
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    exposedHeaders: ['Set-Cookie'],
  });
  
  // Запуск сервера на порті 5000
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
