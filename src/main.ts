import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConsoleLogger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn'],
    // logger: new ConsoleLogger({
    //   prefix: 'MyApp',
    //   json: true,
    // }),
  });

  const config = new DocumentBuilder()
    .setTitle('MikroORM Users example')
    .setDescription('API to manage users using MikroORM')
    .setVersion('1.0')
    .addTag('mikroorm')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
