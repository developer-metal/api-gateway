import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GatewayService } from './services/gateway/gateway.service';
import { GatewayController } from './controllers/gateway/gateway.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AuthMiddleware } from 'src/auth/middleware/auth.middleware';
import { AuthService } from 'src/auth/services/auth.service';
import { RecaptchaService } from 'src/auth/services/recaptcha/recaptcha.service';
@Module({
    imports: [
        HttpModule, 
        ConfigModule
    ],
      controllers: [
        GatewayController
    ],
      providers: [
        GatewayService,
        AuthService,
        RecaptchaService
      ]
})
export class GatewayModule  implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(GatewayController);
  }
}