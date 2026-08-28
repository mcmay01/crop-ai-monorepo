import {
  Controller,
  Get,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AnalysisService } from './analysis.service';
import type { UploadedImage } from './analysis.service';

type AuthenticatedRequest = Request & { user: { id: string; email: string } };

@Controller('analysis')
@UseGuards(JwtAuthGuard)
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Post('crop')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 10 * 1024 * 1024 } }),
  )
  analyze(@Req() req: AuthenticatedRequest, @UploadedFile() file: UploadedImage) {
    return this.analysisService.analyze(req.user.id, file);
  }

  @Get('history')
  history(@Req() req: AuthenticatedRequest) {
    return this.analysisService.history(req.user.id);
  }
}
