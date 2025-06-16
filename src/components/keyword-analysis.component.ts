import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-keyword-analysis',
  standalone: true,
  imports: [CommonModule, MatChipsModule],
  template: `
    <div class="keyword-analysis">
      <h3>Keyword Analysis</h3>
      <div class="keyword-groups">
        <div class="keyword-group">
          <h4>Found Keywords</h4>
          <mat-chip-set>
            <mat-chip *ngFor="let keyword of foundKeywords" color="primary">
              {{ keyword }}
            </mat-chip>
          </mat-chip-set>
        </div>
        <div class="keyword-group">
          <h4>Missing Keywords</h4>
          <mat-chip-set>
            <mat-chip *ngFor="let keyword of missingKeywords" color="warn">
              {{ keyword }}
            </mat-chip>
          </mat-chip-set>
        </div>
      </div>
    </div>
  `
})
export class KeywordAnalysisComponent {
  @Input() foundKeywords: string[] = [];
  @Input() missingKeywords: string[] = [];
}