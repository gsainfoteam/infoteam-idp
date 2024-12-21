import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { ClientModule } from './client/client.module';
import { IdpModule } from './idp/idp.module';
import { UserModule } from './user/user.module';
import { OauthModule } from './oauth/oauth.module';
import { HealthModule } from './health/health.module';
import { LoggerModule } from '@lib/logger';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ClientModule,
    IdpModule,
    UserModule,
    OauthModule,
    HealthModule,
    LoggerModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
