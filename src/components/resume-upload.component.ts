import { Component, Output, EventEmitter } from '@angular/core';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { trigger, transition, style, animate } from '@angular/animations';
import {SharedDataService} from "../services/shared-data.service";

@Component({
  selector: 'app-resume-upload',
  standalone: true,
  imports: [
    NgxDropzoneModule,
    MatProgressBarModule,
    MatSnackBarModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule
  ],
  template: `
    <div class="upload-container" [@fadeIn]>
      <div class="upload-zone"  [class.disabled]="uploadedFileProgress" (click)="!isUploaded && fileInput.click()" [class.analyzing]="isAnalyzing">
        <input
          #fileInput
          type="file"
          style="display: none"
          accept=".pdf"
          (change)="onFileSelected($event)"
        />

        <ng-container *ngIf="!isUploading && !isAnalyzing && !isUploaded">
          <div class="upload-content">
            <mat-icon class="upload-icon">upload_file</mat-icon>
            <h3>Drop your resume here or click to upload</h3>
            <p>Upload your resume in PDF format to analyze with ATS</p>
          </div>
        </ng-container>

        <ng-container *ngIf="isUploading">
          <div class="upload-progress">
            <h3>Uploading your resume...</h3>
            <mat-progress-bar mode="indeterminate" color="accent"></mat-progress-bar>
          </div>
        </ng-container>

        <ng-container *ngIf="isAnalyzing">
          <div class="analysis-progress">
            <div class="analysis-step" [class.active]="currentStep >= 1" [class.completed]="currentStep > 1">
              <mat-icon>description</mat-icon>
              <span>Parsing Resume</span>
              <mat-progress-bar mode="determinate" [value]="getStepProgress(1)" color="primary"></mat-progress-bar>
            </div>

            <div class="analysis-step" [class.active]="currentStep >= 2" [class.completed]="currentStep > 2">
              <mat-icon>analytics</mat-icon>
              <span>Analyzing Content</span>
              <mat-progress-bar mode="determinate" [value]="getStepProgress(2)" color="primary"></mat-progress-bar>
            </div>
          </div>
        </ng-container>

        <ng-container *ngIf="isUploaded">
          <div class="options-container" *ngIf="!showExperienceLevel">
            <h3>What would you like to do with your resume?</h3>
            
            <div class="options-grid">
              <mat-card class="option-card" (click)="selectOption('match-jd')">
                <mat-icon>compare</mat-icon>
                <h4>Match with Job Description</h4>
                <p>Compare your resume against a specific job posting</p>
              </mat-card>

              <mat-card class="option-card" (click)="selectOption('experience')">
                <span class="coming-soon-badge">Coming Soon</span>
                <mat-icon>work</mat-icon>
                <h4>Analyze by Experience Level</h4>
                <p>Get recommendations based on your career stage</p>
              </mat-card>

              <mat-card class="option-card" (click)="selectOption('general')">
                <span class="coming-soon-badge">Coming Soon</span>
                <mat-icon>analytics</mat-icon>
                <h4>General ATS Analysis</h4>
                <p>Check overall ATS compatibility and formatting</p>
              </mat-card>
            </div>
          </div>

          <div class="experience-container" *ngIf="showExperienceLevel">
            <h3>What best describes you?</h3>
            <p class="subtitle">Our AI will use this to personalize your resume review.</p>
            
            <div class="experience-grid">
              <mat-card class="experience-card" (click)="selectExperienceLevel('entry')">
                <mat-icon>school</mat-icon>
                <h4>Entry-level</h4>
                <p>Students & recent graduates. Less than 2 years of work experience.</p>
              </mat-card>

              <mat-card class="experience-card" (click)="selectExperienceLevel('mid')">
                <mat-icon>work</mat-icon>
                <h4>Mid-level</h4>
                <p>You have between 2 and 10 years of relevant work experience.</p>
              </mat-card>

              <mat-card class="experience-card" (click)="selectExperienceLevel('senior')">
                <mat-icon>stars</mat-icon>
                <h4>Senior-level</h4>
                <p>You have more than 10 years of relevant work experience.</p>
              </mat-card>
            </div>

            <button mat-button color="primary" (click)="showExperienceLevel = false">
              <mat-icon>arrow_back</mat-icon> Back to options
            </button>
          </div>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    .upload-container {
      padding: 2rem;
      max-width: 1000px;
      margin: auto;
    }

    .upload-zone {
      border: 2px dashed #3f51b5;
      border-radius: 16px;
      padding: 3rem;
      text-align: center;
      cursor: pointer;
      background: rgba(63, 81, 181, 0.03);
      position: relative;
      transition: all 0.3s ease;
      min-height: 300px;
    }
    .upload-zone.disabled {
      pointer-events: none;
      opacity: 0.6;
      cursor: not-allowed;
    }

    .upload-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .upload-icon {
      font-size: 64px;
      color: #3f51b5;
    }

    .options-container, .experience-container {
      max-width: 900px;
      margin: 0 auto;
      text-align: left;
    }

    .options-grid, .experience-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
      margin-top: 32px;
    }

    .option-card, .experience-card {
      padding: 24px;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 1px solid #e0e0e0;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .option-card:hover, .experience-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
      border-color: #3f51b5;
    }

    .option-card mat-icon, .experience-card mat-icon {
      font-size: 36px;
      height: 36px;
      width: 36px;
      color: #3f51b5;
      margin-bottom: 16px;
    }

    h3 {
      font-size: 24px;
      color: #333;
      margin-bottom: 8px;
    }

    h4 {
      font-size: 18px;
      color: #333;
      margin: 16px 0 8px;
    }

    .subtitle {
      color: #666;
      margin-bottom: 24px;
    }

    p {
      color: #666;
      margin: 0;
      line-height: 1.5;
    }
    .coming-soon-badge {
      position: absolute;
      top: 8px;
      left: 8px;
      background-color: #ffc107; /* amber */
      color: #000;
      font-size: 10px;
      font-weight: bold;
      padding: 2px 6px;
      border-radius: 4px;
      z-index: 1;
      text-transform: uppercase;
    }

    .analysis-progress {
      max-width: 600px;
      margin: 0 auto;
    }

    .analysis-step {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      margin-bottom: 1rem;
      background: #f5f5f5;
      border-radius: 12px;
      opacity: 0.6;
      transition: all 0.3s ease;
    }

    .analysis-step.active {
      opacity: 1;
      background: #ffffff;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
    }

    .analysis-step.completed {
      background: #e8f5e9;
      opacity: 0.8;
    }

    @media (max-width: 768px) {
      .upload-zone {
        padding: 2rem 1rem;
      }

      .options-grid, .experience-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ResumeUploadComponent {
  @Output() fileUploaded = new EventEmitter<void>();
  isUploading = false;
  isAnalyzing = false;
  isUploaded = false;
  showExperienceLevel = false;
  currentStep = 0;
  stepProgress = 0;
  uploadedFileProgress = false;

  constructor(private readonly snackBar: MatSnackBar ,
              private readonly sharedService : SharedDataService) {}

  onFileSelected(event: any) {
    this.uploadedFileProgress = true;
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        this.snackBar.open('Please upload a PDF file', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        return;
      }
      this.sharedService.setFile(file);
      this.startUploadProcess();
    }
  }

  private startUploadProcess() {
    this.isUploading = true;

    setTimeout(() => {
      this.isUploading = false;
      this.isAnalyzing = true;
      this.currentStep = 1;
      this.stepProgress = 0;
      this.startAnalysis();
    }, 2000);
  }

  private startAnalysis() {
    const totalSteps = 2;
    const stepDuration = 1500;
    const progressInterval = 50;

    let currentProgress = 0;

    const progressTimer = setInterval(() => {
      currentProgress += 2;
      this.stepProgress = currentProgress;

      if (currentProgress >= 100) {
        clearInterval(progressTimer);
        this.currentStep++;

        if (this.currentStep <= totalSteps) {
          this.stepProgress = 0;
          this.startAnalysis();
        } else {
          setTimeout(() => {
            this.isAnalyzing = false;
            this.isUploaded = true;
            this.uploadedFileProgress = false;
            this.snackBar.open('Resume upload complete!', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          }, 600);
        }
      }
    }, progressInterval);
  }

  selectOption(option: string) {
    switch (option) {
      case 'match-jd':
        this.fileUploaded.emit();
        break;
      case 'experience':
        this.showExperienceLevel = true;
        break;
      case 'general':
        this.fileUploaded.emit();
        break;
    }
  }

  selectExperienceLevel(level: string) {
    // Handle experience level selection
    this.fileUploaded.emit();
  }

  getStepProgress(step: number): number {
    if (this.currentStep > step) return 100;
    if (this.currentStep === step) return this.stepProgress;
    return 0;
  }
}