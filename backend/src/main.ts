import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const frontendUrl = process.env.FRONTEND_URL;
  if (!frontendUrl) {
    console.warn('FRONTEND_URL не встановлено в змінних середовища. CORS буде дозволено тільки для localhost:3000');
  }
  
  const allowedOrigins = [
    'http://localhost:3000',
    'https://train-schedule-nu.vercel.app',
    'https://train-schedule-nu.vercel.app/',
  ];
  
  if (frontendUrl) {
    allowedOrigins.push(frontendUrl);
  }
  
  // Налаштування CORS для дозволу запитів з фронтенду
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    exposedHeaders: ['Set-Cookie'],
  });
  
  // Запуск сервера на порті 8080
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
