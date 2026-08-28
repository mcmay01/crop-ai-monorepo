import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { desc, eq } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import sharp from 'sharp';
import { cropRecords } from '../db/schema';
import type * as schema from '../db/schema';
import type { AnalysisResult, CropRecord } from 'shared-types';

type DB = NodePgDatabase<typeof schema>;

type AiResponse =
  (AnalysisResult & { success: true }) | { success: false; error: string };

export interface UploadedImage {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

@Injectable()
export class AnalysisService {
  constructor(
    @Inject('DRIZZLE_CLIENT') private readonly db: DB,
    private readonly config: ConfigService,
  ) {}

  async analyze(userId: string, file: UploadedImage): Promise<CropRecord> {
    const optimized = await sharp(file.buffer)
      .resize(512, 512, { fit: 'inside' })
      .jpeg({ quality: 80 })
      .toBuffer();

    const aiUrl =
      this.config.get<string>('PYTHON_AI_URL') ??
      'http://localhost:8000/predict';

    const form = new FormData();
    form.append(
      'file',
      new Blob([optimized], { type: 'image/jpeg' }),
      file.originalname,
    );

    let result: AiResponse;
    try {
      const res = await fetch(aiUrl, { method: 'POST', body: form });
      result = (await res.json()) as AiResponse;
    } catch (err) {
      throw new BadRequestException(
        `AI service unavailable: ${(err as Error).message}`,
      );
    }

    if (!result.success) {
      throw new BadRequestException(result.error);
    }

    const [record] = await this.db
      .insert(cropRecords)
      .values({
        userId,
        imageUrl: file.originalname, // placeholder until S3/Cloudinary is wired
        prediction: result.prediction,
        confidence: result.confidence,
        disease: result.disease ?? null,
        treatment: result.treatment ?? null,
      })
      .returning();

    return record;
  }

  // async analyzeCropImage(
  //   userId: string,
  //   fileBuffer: Buffer,
  //   originalName: string,
  // ): Promise<any> {
  //   try {
  //     // 1. Optimize image (resize + compress)
  //     const optimizedBuffer = await sharp(fileBuffer)
  //       .resize({ width: 1024, height: 1024, fit: 'inside' })
  //       .jpeg({ quality: 80 })
  //       .toBuffer();

  //     // 2. Call Python AI service
  //     const formData = new FormData();
  //     formData.append('file', optimizedBuffer, {
  //       filename: originalName || 'image.jpg',
  //       contentType: 'image/jpeg',
  //     });

  //     const aiResponse = await axios.post(
  //       process.env.PYTHON_AI_URL || 'http://localhost:8000/predict',
  //       formData,
  //       {
  //         headers: {
  //           ...formData.getHeaders(),
  //         },
  //         timeout: 30000,
  //       },
  //     );

  //     if (!aiResponse.data.success) {
  //       throw new HttpException(
  //         aiResponse.data.error || 'AI service error',
  //         HttpStatus.INTERNAL_SERVER_ERROR,
  //       );
  //     }

  //     const result = aiResponse.data;

  //     // 3. Save to database
  //     // For now, store as base64 (in production use S3/Cloudinary)
  //     const imageBase64 = optimizedBuffer.toString('base64');
  //     const imageUrl = `data:image/jpeg;base64,${imageBase64}`;

  //     const [record] = await this.db
  //       .insert(schema.cropRecords)
  //       .values({
  //         userId,
  //         imageUrl,
  //         prediction: result.prediction,
  //         confidence: result.confidence,
  //         disease: result.disease || null,
  //         treatment: result.treatment || null,
  //       })
  //       .returning();

  //     return {
  //       record,
  //       analysis: {
  //         prediction: result.prediction,
  //         confidence: result.confidence,
  //         disease: result.disease,
  //         treatment: result.treatment,
  //         all_scores: result.all_scores,
  //       },
  //     };
  //   } catch (error) {
  //     if (error instanceof HttpException) throw error;
  //     throw new HttpException(
  //       error.message || 'Analysis failed',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  async history(userId: string): Promise<CropRecord[]> {
    return this.db
      .select()
      .from(cropRecords)
      .where(eq(cropRecords.userId, userId))
      .orderBy(desc(cropRecords.createdAt));
  }
}
