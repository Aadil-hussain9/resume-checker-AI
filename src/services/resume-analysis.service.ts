import { Injectable } from '@angular/core';
import { ResumeAnalysis } from '../models/score.model';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ResumeAnalysisService {
  getDummyAnalysis(): ResumeAnalysis {
    return {
      overallScore: 82,
      sections: [
        {
          name: 'Experience',
          score: 85,
          recommendations: [
            'Add more quantifiable achievements',
            'Include relevant keywords from the job description',
            'Use action verbs to start bullet points'
          ]
        },
        {
          name: 'Skills',
          score: 90,
          recommendations: [
            'Consider adding more technical skills',
            'Organize skills by categories',
            'Include proficiency levels for each skill'
          ]
        },
        {
          name: 'Education',
          score: 75,
          recommendations: [
            'Add relevant coursework',
            'Include GPA if above 3.5',
            'List academic achievements and honors'
          ]
        },
        {
          name: 'Formatting',
          score: 78,
          recommendations: [
            'Ensure consistent spacing throughout',
            'Use bullet points for better readability',
            'Keep resume length to 1-2 pages'
          ]
        }
      ],
      foundKeywords: [
        'JavaScript',
        'React',
        'Node.js',
        'TypeScript',
        'REST API',
        'Agile'
      ],
      missingKeywords: [
        'Docker',
        'Kubernetes',
        'CI/CD',
        'AWS',
        'Python'
      ]
    };
  }

  constructor(private readonly http: HttpClient) { }


  baseUrl = 'http://localhost:8001';

  // constructor(private http: HttpClient) {}
  //
  // analyzeResume(file: File): Observable<ResumeAnalysisResult> {
  //   const formData = new FormData();
  //   formData.append('resume', file);
  //   return this.http.post<ResumeAnalysisResult>(`${this.baseUrl}/analyze`, formData);
  // }
  getResumeAnalysisReport(file: File | null, jd: string): Observable<ResumeAnalysis> {
    debugger
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    formData.append('desc', jd);

    return this.http.post<ResumeAnalysis>(`${this.baseUrl}/check-resume`, formData);
  }
}

export interface ResumeAnalysisResult {
  matchPercentage: number;
  unmatchedKeywords: string[];
  suggestions: string[];
}