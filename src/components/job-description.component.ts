import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {SharedDataService} from "../services/shared-data.service";

@Component({
  selector: 'app-job-description',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="job-description-wrapper">
      <h2><mat-icon>description</mat-icon> Job Description Analysis</h2>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Paste Job Description</mat-label>
        <textarea
          matInput
          [(ngModel)]="jobDescription"
          rows="8"
          placeholder="Paste the job description here..."
        ></textarea>
      </mat-form-field>

      <button
        mat-raised-button
        color="primary"
        (click)="analyzeJobDescription()"
        [disabled]="!jobDescription"
        class="analyze-button"
      >
        <mat-icon>analytics</mat-icon>
        Analyze Match
      </button>
    </div>
  `,
  styles: [`
    .job-description-wrapper {
      padding: 30px;
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 6px 18px rgba(0,0,0,0.05);
      display: flex;
      flex-direction: column;
      gap: 20px;
      max-width: 700px;
      margin: auto;
    }

    h2 {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 1.5rem;
      font-weight: 600;
      color: #2c3e50;
      margin: 0;
    }

    .full-width {
      width: 100%;
    }
    
    .analyze-button {
      background-color: #1976d2; /* Optional override primary */
      color: white;
      align-self: flex-start;
      padding: 10px 20px;
      font-weight: 600;
      font-size: 14px;
      text-transform: uppercase;
      display: flex;
      gap: 8px;
      border-radius: 8px;
      transition: background-color 0.3s ease;
    }

    .analyze-button:hover {
      background-color: #1565c0;
    }

    .analyze-icon {
      font-size: 20px;
    }

    ::ng-deep textarea.mat-input-element {
      font-size: 0.95rem;
      line-height: 1.5;
    }
  `]
})
export class JobDescriptionComponent {
  @Output() analyzed = new EventEmitter<void>();
  jobDescription = '';

  constructor(private readonly sharedService:SharedDataService) {
  }
  analyzeJobDescription() {
    if (this.jobDescription) {
      this.sharedService.setJD(this.jobDescription);
      this.analyzed.emit();
    }
  }
}
