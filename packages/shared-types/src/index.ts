export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
}

export interface Farm {
  id: string
  name: string
  lat?: number
  lng?: number
  userId?: string
  createdAt: Date
}

export interface CropRecord {
  id: string
  userId: string
  imageUrl: string
  prediction: string
  confidence: number
  disease: string | null
  treatment: string | null
  createdAt: Date
}

export interface AnalysisResult {
  success: boolean
  prediction: string
  confidence: number
  disease?: string | null
  treatment?: string | null
  all_scores?: Record<string, number>
}
