import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { users } from '../db/schema';
import type * as schema from '../db/schema';
import type { User } from 'shared-types';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

type DB = NodePgDatabase<typeof schema>;

@Injectable()
export class AuthService {
  constructor(
    @Inject('DRIZZLE_CLIENT') private readonly db: DB,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<User> {
    const existing = await this.db
      .select()
      .from(users)
      .where(eq(users.email, dto.email));

    if (existing.length > 0) {
      throw new ConflictException('Email already registered');
    }

    const password = await bcrypt.hash(dto.password, 10);
    const [created] = await this.db
      .insert(users)
      .values({ email: dto.email, name: dto.name, password })
      .returning();

    const { password: _password, ...user } = created;
    return user;
  }

  async login(dto: LoginDto): Promise<{ user: User; token: string }> {
    const rows = await this.db
      .select()
      .from(users)
      .where(eq(users.email, dto.email));
    const record = rows[0];

    if (!record) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, record.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _password, ...user } = record;
    return {
      user,
      token: this.jwtService.sign({ sub: record.id, email: record.email }),
    };
  }
}
