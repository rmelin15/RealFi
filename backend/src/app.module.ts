import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AssetsModule } from './modules/assets/assets.module';
import { OfferingsModule } from './modules/offerings/offerings.module';
import { LendableAssetsModule } from './modules/lendable-assets/lendable-assets.module';
import { PortfolioModule } from './modules/portfolio/portfolio.module';
import { InstrumentsModule } from './modules/instruments/instruments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),
    PrismaModule,
    AuthModule,
    UsersModule,
    AssetsModule,
    OfferingsModule,
    LendableAssetsModule,
    PortfolioModule,
    InstrumentsModule,
  ],
})
export class AppModule {}


















