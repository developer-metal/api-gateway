import { Module } from '@nestjs/common';
import { GatewayModule } from './gateway/gateway.module';
import { ConfigModule } from '@nestjs/config';
import { configOptions } from './config/config-loader';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { configConnect } from './config/config-connection';
import { FeedbackModule } from './feedback/feedback.module';
import { BulkDataUploadModule } from './bulk-data-upload/bulk-data-upload.module';
import { MulterModule } from '@nestjs/platform-express';
@Module({
  imports: [
    ConfigModule.forRoot(configOptions),
    MongooseModule.forRootAsync(configConnect),
    MulterModule.registerAsync({
      useFactory: () => ({
        dest: './upload'
      })
    }),
    AuthModule,
    GatewayModule,
    FeedbackModule,
    BulkDataUploadModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
