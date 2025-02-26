import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new PrismaExceptionFilter());
  app.enableCors({
    origin: 'https://pokeprice-test.netlify.app/', 
    methods: 'GET,POST,PUT,DELETE',
    credentials: true
  });

  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
