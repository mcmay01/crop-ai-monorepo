export class AnalysisResponseDto {
  success: boolean;
  prediction: string;
  confidence: number;
  disease?: string;
  treatment?: string;
  all_scores?: Record<string, number>;
}
