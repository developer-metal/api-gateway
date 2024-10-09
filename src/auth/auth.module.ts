import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HealthCheckController } from './controllers/healthcheck/healthCheck.controller';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';
import { RecaptchaService } from './services/recaptcha/recaptcha.service';
import { UsersService } from './services/usersAws/users.service';
import { AuthUsersController } from './controllers/auth/auth-users/auth-users.controller';
import { TerminusModule } from '@nestjs/terminus';
import { UsersLocalsService } from './services/users-locals/users-locals.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersLocalsProviders } from './models/usersLocals.providers';
import { GroupProjectsProviders } from './models/groupProject.providers';
import { GroupProjectsService } from './services/users-locals/group-projects/group-projects.service';
import { ProfilesService } from './services/users-locals/profiles/profiles.service';
import { ProfilesProviders } from './models/profiles.providers';
@Module({
  imports: [
    MongooseModule.forFeatureAsync([UsersLocalsProviders,GroupProjectsProviders, ProfilesProviders]),
    TerminusModule,
  HttpModule,
  ConfigModule,
  GoogleRecaptchaModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      secretKey: configService.get('googleRecaptchaOptions'),
      response: req => req.headers['recaptcha']
    }),
    inject: [ConfigService]
    })
  ],
  providers: [AuthService, RecaptchaService, UsersService, UsersLocalsService, GroupProjectsService, ProfilesService],
  controllers: [HealthCheckController, AuthUsersController]
})
export class AuthModule {
}
