import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import bodyParser from 'body-parser';
import * as fs from 'fs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionFilter } from './common/filters/http-exception.filter';
const bootstrap = async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule , { cors: {
    origin: ['https://devpldd.tbkapoyandonegocios.cl','https://tbkapoyandonegocios.cl','https://www.tbkapoyandonegocios.cl','https://hermes-contact-api.tbkapoyandonegocios.cl','https://tbk.knowbox.es'],
    credentials: true,
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS','PATCH','HEAD']
  } });
  const configSetup = app.get(ConfigService);
  const port: number = configSetup.get('port');
  app.useGlobalFilters(new AllExceptionFilter());
  app.use(bodyParser.json({ limit: '100mb' }));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.useGlobalPipes(new ValidationPipe({ disableErrorMessages: false, whitelist: true, transform: true }));
  app.setGlobalPrefix('bff/v1');
  const options = new DocumentBuilder()
  .setTitle('Bff contact API')
  .setDescription('Hermes contact Bff')
  .setVersion('0.2.0')
  .build();
const document = SwaggerModule.createDocument(app, options);
document.servers = [{url: 'http://localhost:5500', description: 'Servidor local' }]
document.externalDocs = { url: 'http://localhost:5500/contact-bff/docs-json', description: 'Documentación BFF formato json'};
fs.writeFileSync("./doc/swagger/backend.json", JSON.stringify(document)); 
fs.writeFileSync("./doc/swagger/backend.yaml", JSON.stringify(document)); 
SwaggerModule.setup('/contact-bff/docs', app, document, { customCss: '.swagger-ui .topbar { display: none }' });
await app.listen(port);
}
bootstrap();