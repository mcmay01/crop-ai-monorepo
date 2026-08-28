import {
  Controller,
  Get,
  NotFoundException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';

type AuthenticatedRequest = Request & { user: { id: string; email: string } };

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async me(@Req() req: AuthenticatedRequest) {
    const user = await this.usersService.findById(req.user.id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
