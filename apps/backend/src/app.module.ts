import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AnalysisModule } from './analysis/analysis.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DrizzleModule } from './db/drizzle.module';
import { HealthController } from './health/health.controller';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env', '../../.env'] }),
    DrizzleModule,
    AuthModule,
    UsersModule,
    AnalysisModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
