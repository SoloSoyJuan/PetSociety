import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuración de CORS ANTES de app.listen()
  app.enableCors({
    origin: [
      'http://localhost:3000',  // Tu frontend en desarrollo
      'https://petsociety-production.up.railway.app'  // Tu frontend en producción
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // app.listen() debe ser lo último
  await app.listen(3000);
}
bootstrap();