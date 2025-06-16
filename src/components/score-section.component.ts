import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { trigger, transition, style, animate } from '@angular/animations';
import { ScoreSection } from '../models/score.model';

@Component({
  selector: 'app-score-section',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule],
  template: `
    <div class="score-card" [@fadeIn]>
      <div style="flex: 1">
        <h3>{{ section.name }}</h3>
        <mat-progress-bar
          [value]="section.score"
          [class.good]="section.score >= 80"
          [class.medium]="section.score >= 60 && section.score < 80"
          [class.poor]="section.score < 60"
        ></mat-progress-bar>
        <p>{{ section.score }}/100</p>
      </div>
    </div>
    <div class="recommendations">
      <div *ngFor="let rec of section.recommendations" class="recommendation-item">
        {{ rec }}
      </div>
    </div>
  `,
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ScoreSectionComponent {
  @Input() section!: ScoreSection;
}