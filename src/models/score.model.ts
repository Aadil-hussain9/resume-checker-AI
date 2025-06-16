export interface ScoreSection {
  name: string;
  score: number;
  recommendations: string[];
}

export interface ResumeAnalysis {
  overallScore: number;
  sections: ScoreSection[];
  foundKeywords: string[];
  missingKeywords: string[];
}