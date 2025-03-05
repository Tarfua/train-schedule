import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Налаштування CORS для дозволу запитів з фронтенду
  app.enableCors({
    origin: [process.env.FRONTEND_URL || 'http://localhost:3000', 'http://localhost'], // Дозволяємо запити з localhost без порту
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });
  
  // Запуск сервера на порті 5000
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
