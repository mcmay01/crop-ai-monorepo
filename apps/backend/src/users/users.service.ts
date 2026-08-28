import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { users } from '../db/schema';
import type * as schema from '../db/schema';
import type { User } from 'shared-types';

type DB = NodePgDatabase<typeof schema>;

@Injectable()
export class UsersService {
  constructor(@Inject('DRIZZLE_CLIENT') private readonly db: DB) {}

  async findById(id: string): Promise<User | null> {
    const rows = await this.db.select().from(users).where(eq(users.id, id));
    const record = rows[0];
    if (!record) return null;

    const { password: _password, ...user } = record;
    return user;
  }
}
