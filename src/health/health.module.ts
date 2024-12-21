import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { RedisModule } from '@nestjs-modules/ioredis';
import { RedisIndicator } from './indicator/redis.indicator';
import { PrismaModule } from '@lib/prisma';

@Module({
  imports: [
    PrismaModule,
    TerminusModule.forRoot({ errorLogStyle: 'json' }),
    RedisModule,
  ],
  providers: [RedisIndicator],
  controllers: [HealthController],
})
export class HealthModule {}
