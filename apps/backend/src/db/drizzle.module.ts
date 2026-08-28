import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

@Global()
@Module({
  providers: [
    {
      provide: 'DRIZZLE_CLIENT',
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const pool = new Pool({
          connectionString: config.get<string>('DATABASE_URL'),
        });
        return drizzle(pool, { schema });
      },
    },
  ],
  exports: ['DRIZZLE_CLIENT'],
})
export class DrizzleModule {}
