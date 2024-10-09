import { Module } from '@nestjs/common';
import { FeedbackService } from './services/feedback.service';
import { FeedbackController } from './controllers/feedback.controller';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { FeedbackProviders } from './models/feedback.providers';
import { GeneratorsTokenController } from './controllers/generators-token/generators-token.controller';
import { GeneratorsTokenService } from './services/generators-token/generators-token.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../config/config-jwt';
import { CsvExportService } from './services/csv-export/csv-export.service';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeatureAsync([FeedbackProviders]),
    JwtModule.register({
      global: false,
      secret: jwtConstants.secret
    })
  ],
  controllers: [FeedbackController, GeneratorsTokenController],
  providers: [FeedbackService, GeneratorsTokenService, CsvExportService]
})
export class FeedbackModule {}
