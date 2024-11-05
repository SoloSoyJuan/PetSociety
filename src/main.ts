import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);

  // Configuración de CORS
  app.enableCors({
    origin: [
      'http://localhost:3000',  // Tu frontend en desarrollo
      'petsociety-production.up.railway.app'  // Tu frontend en producción
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });
}
bootstrap();
