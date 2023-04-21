import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.APP_PORT;
  const swaggerLink = process.env.SWAGGER_LINK;
  const config = new DocumentBuilder()
    .setTitle('Firefly test')
    .setDescription('Server Firefly test')
    .setVersion('1.0')
    .addTag('default')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT, () => {
    console.log(`Server running port: ${PORT}`);
    console.log(`Swagger UI on ${swaggerLink}`);
  });
}
bootstrap();
