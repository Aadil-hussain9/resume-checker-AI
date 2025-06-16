import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

import { ResumeUploadComponent } from './components/resume-upload.component';
import { ScoreSectionComponent } from './components/score-section.component';
import { JobDescriptionComponent } from './components/job-description.component';
import { KeywordAnalysisComponent } from './components/keyword-analysis.component';
import { ResumeAnalysisService } from './services/resume-analysis.service';
import { ResumeAnalysis } from './models/score.model';
import { ResumeBuilderComponent } from './components/resume-builder.component';
import {FooterComponent} from "./components/footer.component";
import {MatDialog} from "@angular/material/dialog";
import {BookingDialogComponent} from "./components/booking-dialog.component";
import {provideAnimations} from "@angular/platform-browser/animations";
import {SharedDataService} from "./services/shared-data.service";
import {provideHttpClient} from "@angular/common/http";
import {LoaderService} from "./services/loader.service";
import {LoaderComponent} from "./components/loader.component";
import {finalize, Observable} from "rxjs";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressBarModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    ResumeUploadComponent,
    ScoreSectionComponent,
    JobDescriptionComponent,
    KeywordAnalysisComponent,
    ResumeBuilderComponent,
    LoaderComponent,
    FooterComponent,
  ],
  template: `
    <div class="app-layout">
      <button 
        class="nav-toggle" 
        [class.active]="!isSidebarCollapsed"
        (click)="toggleSidebar()"
        [@buttonAnimation]>
        <i class="material-icons">{{ isSidebarCollapsed ? 'menu' : 'close' }}</i>
      </button>

      <nav class="side-nav" [class.collapsed]="isSidebarCollapsed" [@sideNavAnimation]>
        <div class="nav-header">
          <img src="https://avatars.githubusercontent.com/u/139895814" alt="Logo" class="nav-logo" />
          <h2 class="nav-title" *ngIf="!isSidebarCollapsed">Resume ATS</h2>
        </div>

        <div class="nav-items" [@listAnimation]="isSidebarCollapsed ? 'collapsed' : 'expanded'">
          <div 
            class="nav-item" 
            [class.active]="currentPage === 'home'"
            (click)="navigateTo('home')"
            [@navItemAnimation]>
            <i class="material-icons">home</i>
            <span>Home</span>
          </div>
          <div 
            class="nav-item" 
            [class.active]="currentPage === 'about'"
            (click)="navigateTo('about')"
            [@navItemAnimation]>
            <i class="material-icons">person</i>
            <span>About</span>
          </div>
          <div 
            class="nav-item"
            [class.active]="currentPage === 'expert'"
            (click)="navigateTo('expert')"
            [@navItemAnimation]>
            <i class="material-icons">rate_review</i>
            <span>Expert Review</span>
          </div>
          <div 
            class="nav-item"
            [class.active]="currentPage === 'schedule'"
            (click)="navigateTo('schedule')"
            [@navItemAnimation]>
            <i class="material-icons">event</i>
            <span>Schedule</span>
          </div>
          <div 
            class="nav-item"
            [class.active]="currentPage === 'settings'"
            (click)="navigateTo('settings')"
            [@navItemAnimation]>
            <i class="material-icons">settings</i>
            <span>Settings</span>
          </div>
          <div 
            class="nav-item"
            [class.active]="currentPage === 'help'"
            (click)="navigateTo('help')"
            [@navItemAnimation]>
            <i class="material-icons">help</i>
            <span>Help</span>
          </div>
          <div 
            class="nav-item"
            [class.active]="currentPage === 'builder'"
            (click)="navigateTo('builder')"
            [@navItemAnimation]>
            <i class="material-icons">description</i>
            <span>Resume Builder</span>
          </div>
        </div>
      </nav>

      <div class="main-content" [class.expanded]="isSidebarCollapsed" [@contentAnimation]>
        <div class="container">
          <!-- Home Page -->
          <div *ngIf="currentPage === 'home'" [@pageAnimation]>
            <div class="page-header">
              <h1 class="page-title">Resume ATS Checker</h1>
              <p class="page-subtitle">Optimize your resume for Applicant Tracking Systems</p>
            </div>
            
            <div *ngIf="!showResults" class="card">
              <app-resume-upload (fileUploaded)="onFileUploaded()"></app-resume-upload>
            </div>

            <div class="card" *ngIf="showJobDescription && !showResults" [@slideIn]>
              <app-job-description (analyzed)="onJobDescriptionAnalyzed()"></app-job-description>
            </div>

            <div class="results-container" *ngIf="showResults" [@fadeIn]>
              <div class="card result-card">
                <h2 class="section-title">Analysis Results</h2>
                <div class="overall-score">
                  <div class="score-circle" [style.background]="getScoreColor()">
                    {{ analysis.geminiAnalysis.overallScore }}
                  </div>
                  <h3>Overall ATS Score</h3>
                </div>

                <app-keyword-analysis
                  [foundKeywords]="analysis.geminiAnalysis.foundKeywords"
                  [missingKeywords]="analysis.geminiAnalysis.missingKeywords"
                ></app-keyword-analysis>

                <div class="sections-grid">
                  <div *ngFor="let section of analysis.geminiAnalysis.sections" class="section-card" [@cardAnimation]>
                    <app-score-section [section]="section"></app-score-section>
                  </div>
                </div>

                <button
                    mat-raised-button
                    color="accent"
                    (click)="downloadReport()"
                    class="download-button"
                >
                  <mat-icon class="download-icon">download</mat-icon>
                  <span>Download Report</span>
                </button>

              </div>
            </div>
          </div>
          <app-loader *ngIf="loading$ | async"></app-loader>

          <!-- About Page -->
          <div *ngIf="currentPage === 'about'" [@pageAnimation] class="about-page">
            <div class="page-header">
              <h1 class="page-title">About ATS Checker</h1>
              <p class="page-subtitle">Your path to resume optimization</p>
            </div>

            <div class="features-grid">
              <div class="feature-card" [@cardAnimation]>
                <mat-icon>analytics</mat-icon>
                <h3>AI-Powered Analysis</h3>
                <p>Our advanced AI algorithms analyze your resume against industry standards</p>
              </div>
              <div class="feature-card" [@cardAnimation]>
                <mat-icon>psychology</mat-icon>
                <h3>Keyword Optimization</h3>
                <p>Identify missing keywords and optimize content for ATS systems</p>
              </div>
              <div class="feature-card" [@cardAnimation]>
                <mat-icon>verified</mat-icon>
                <h3>Expert Review</h3>
                <p>Get personalized feedback from HR professionals</p>
              </div>
              <div class="feature-card" [@cardAnimation]>
                <mat-icon>speed</mat-icon>
                <h3>Real-time Scoring</h3>
                <p>Instant feedback on your resume's ATS compatibility</p>
              </div>
            </div>
            <app-footer></app-footer>
          </div>

          <!-- Expert Review Page -->
          <div *ngIf="currentPage === 'expert'" [@pageAnimation] class="expert-page">
            <div class="page-header">
              <h1 class="page-title">Expert Review Service</h1>
              <p class="page-subtitle">Get professional feedback on your resume</p>
            </div>

            <div class="expert-grid">
              <div class="expert-card" [@cardAnimation]>
                <img src="assets/images/1734434314234.jpeg" alt="Expert" class="expert-image">
                <h3>Aadil Dar</h3>
                <p>Senior Software Engineer</p>
                <button class="schedule-btn" mat-raised-button color="primary" (click)="scheduleReview()">Schedule Review</button>
              </div>
              <div class="expert-card" [@cardAnimation]>
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Expert" class="expert-image">
                <h3>Michael Chen</h3>
                <p>Tech Recruitment Specialist</p>
                <button class="schedule-btn" mat-raised-button color="primary">Schedule Review</button>
              </div>
              <div class="expert-card" [@cardAnimation]>
                <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Expert" class="expert-image">
                <h3>Emily Rodriguez</h3>
                <p>Career Coach</p>
                <button class="schedule-btn" mat-raised-button color="primary">Schedule Review</button>
              </div>
            </div>
          </div>

          <!-- Schedule Page -->
          <div *ngIf="currentPage === 'schedule'" [@pageAnimation] class="schedule-page">
            <div class="page-header">
              <h1 class="page-title">Schedule Consultation</h1>
              <p class="page-subtitle">Book your one-on-one session</p>
            </div>

            <div class="calendar-container card">
              <div class="calendar-header">
                <button mat-icon-button><mat-icon>chevron_left</mat-icon></button>
                <h3>September 2025</h3>
                <button mat-icon-button><mat-icon>chevron_right</mat-icon></button>
              </div>
              <div class="calendar-grid">
                <!-- Calendar grid would be dynamically generated -->
                <div class="calendar-day" *ngFor="let day of getDummyDays()" [@calendarAnimation]>
                  <span class="day-number">{{day}}</span>
                  <div class="time-slots">
                    <button mat-button color="primary" class="time-slot">10:00 AM</button>
                    <button mat-button color="primary" class="time-slot">2:00 PM</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Settings Page -->
          <div *ngIf="currentPage === 'settings'" [@pageAnimation] class="settings-page">
            <div class="page-header">
              <h1 class="page-title">Settings</h1>
              <p class="page-subtitle">Customize your experience</p>
            </div>

            <div class="settings-grid">
              <div class="settings-card" [@cardAnimation]>
                <mat-icon>account_circle</mat-icon>
                <h3>Profile Settings</h3>
                <button mat-raised-button>Edit Profile</button>
              </div>
              <div class="settings-card" [@cardAnimation]>
                <mat-icon>notifications</mat-icon>
                <h3>Notifications</h3>
                <button mat-raised-button>Configure</button>
              </div>
              <div class="settings-card" [@cardAnimation]>
                <mat-icon>security</mat-icon>
                <h3>Privacy</h3>
                <button mat-raised-button>Manage</button>
              </div>
              <div class="settings-card" [@cardAnimation]>
                <mat-icon>payment</mat-icon>
                <h3>Billing</h3>
                <button mat-raised-button>View Plans</button>
              </div>
            </div>
          </div>

          <!-- Help Page -->
          <div *ngIf="currentPage === 'help'" [@pageAnimation] class="help-page">
            <div class="page-header">
              <h1 class="page-title">Help Center</h1>
              <p class="page-subtitle">Find answers to your questions</p>
            </div>

            <div class="help-grid">
              <div class="help-card" [@cardAnimation]>
                <mat-icon>school</mat-icon>
                <h3>Getting Started</h3>
                <p>Learn the basics of using our ATS checker</p>
                <button mat-button color="primary">Learn More</button>
              </div>
              <div class="help-card" [@cardAnimation]>
                <mat-icon>book</mat-icon>
                <h3>User Guide</h3>
                <p>Detailed documentation and tutorials</p>
                <button mat-button color="primary">View Guide</button>
              </div>
              <div class="help-card" [@cardAnimation]>
                <mat-icon>chat</mat-icon>
                <h3>FAQs</h3>
                <p>Common questions and answers</p>
                <button mat-button color="primary">View FAQs</button>
              </div>
              <div class="help-card" [@cardAnimation]>
                <mat-icon>support_agent</mat-icon>
                <h3>Support</h3>
                <p>Contact our support team</p>
                <button mat-button color="primary">Get Help</button>
              </div>
            </div>
          </div>

          <!-- Resume Builder Page -->
          <div *ngIf="currentPage === 'builder'" [@pageAnimation]>
            <app-resume-builder></app-resume-builder>
          </div>
        </div>

        <div class="floating-action-button pulse-animation" *ngIf="showResults" [@buttonAnimation]>
          <i class="material-icons">chat</i>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: #f8f9fa;
    }

    .app-layout {
      display: flex;
      min-height: 100vh;
    }

    /* Navigation Styles */
    .nav-toggle {
      position: fixed;
      top: 20px;
      left: 20px;
      z-index: 1000;
      background: white;
      border: none;
      border-radius: 50%;
      width: 48px;
      height: 48px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .nav-toggle:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }

    .nav-toggle.active {
      background: #3f51b5;
      color: white;
    }

    .side-nav {
      width: 280px;
      background: #1a237e;
      color: white;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: fixed;
      height: 100vh;
      z-index: 100;
      padding-top: 80px;
      overflow-y: auto;
    }
    .schedule-btn {
      padding: 10px 24px;
      font-size: 16px;
      font-weight: 600;
      border-radius: 8px;
      text-transform: uppercase;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transition: all 0.3s ease;

      &:hover {
        background-color: #1976d2;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
        transform: translateY(-1px);
      }

      &:active {
        box-shadow: none;
        transform: translateY(0);
      }

      &:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.3);
      }
    }


    .side-nav.collapsed {
      width: 80px;
    }

    .nav-header {
      padding: 0 20px;
      margin-bottom: 40px;
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .nav-logo {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }

    .nav-title {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 500;
      white-space: nowrap;
    }

    .nav-items {
      padding: 0 10px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      padding: 15px;
      margin: 5px 0;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      color: rgba(255, 255, 255, 0.7);
    }

    .nav-item:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      transform: translateX(5px);
    }

    .nav-item.active {
      background: rgba(255, 255, 255, 0.2);
      color: white;
    }

    .nav-item i {
      margin-right: 15px;
    }

    /* Main Content Styles */
    .main-content {
      margin-left: 280px;
      padding: 40px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      width: calc(100% - 280px);
    }

    .main-content.expanded {
      margin-left: 80px;
      width: calc(100% - 80px);
    }

    .page-header {
      margin-bottom: 40px;
      text-align: center;
    }

    .page-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1a237e;
      margin: 0;
      line-height: 1.2;
    }

    .page-subtitle {
      font-size: 1.2rem;
      color: #666;
      margin: 10px 0 0 0;
    }

    /* Card Styles */
    .card {
      background: white;
      border-radius: 16px;
      padding: 30px;
      margin-bottom: 30px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }

    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    }

    /* Grid Layouts */
    .features-grid,
    .expert-grid,
    .settings-grid,
    .help-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 30px;
      margin-top: 40px;
    }

    /* Feature Cards */
    .feature-card {
      background: white;
      padding: 30px;
      border-radius: 16px;
      text-align: center;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }

    .feature-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    }

    .feature-card mat-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      color: #3f51b5;
      margin-bottom: 20px;
    }
    .download-button {
      background-color: #43a047; /* Optional green theme */
      color: white;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 14px;
      padding: 0.6rem 1.2rem;
      display: flex;
      align-items: center;
      gap: 8px;
      border-radius: 8px;
      transition: background-color 0.3s ease;
    }

    .download-button:hover {
      background-color: #388e3c;
    }

    .download-icon {
      font-size: 20px;
    }


    /* Expert Cards */
    .expert-card {
      background: white;
      padding: 30px;
      border-radius: 16px;
      text-align: center;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .expert-image {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      margin-bottom: 20px;
      object-fit: cover;
    }

    /* Calendar Styles */
    .calendar-container {
      max-width: 1000px;
      margin: 0 auto;
    }

    .calendar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .calendar-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 15px;
    }

    .calendar-day {
      background: white;
      padding: 15px;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .day-number {
      font-size: 1.2rem;
      font-weight: 500;
      color: #333;
    }

    .time-slots {
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .time-slot {
      font-size: 0.9rem;
    }

    /* Results Styles */
    .results-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .result-card {
      position: relative;
      overflow: hidden;
    }

    .overall-score {
      text-align: center;
      margin-bottom: 40px;
    }

    .score-circle {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
      font-weight: 700;
      color: white;
      margin: 0 auto 20px;
      position: relative;
      overflow: hidden;
    }

    .sections-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
      margin-top: 40px;
    }

    .section-card {
      background: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    /* Floating Action Button */
    .floating-action-button {
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: #3f51b5;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(63, 81, 181, 0.4);
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .floating-action-button:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 30px rgba(63, 81, 181, 0.6);
    }

    @media (max-width: 768px) {
      .side-nav {
        width: 240px;
        transform: translateX(-100%);
      }

      .side-nav.collapsed {
        transform: translateX(0);
        width: 240px;
      }

      .main-content {
        margin-left: 0;
        width: 100%;
        padding: 20px;
      }

      .main-content.expanded {
        margin-left: 0;
        width: 100%;
      }

      .features-grid,
      .expert-grid,
      .settings-grid,
      .help-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
  animations: [
    trigger('buttonAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)',
            style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),
    trigger('sideNavAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)',
            style({ transform: 'translateX(0)' }))
      ])
    ]),
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('300ms cubic-bezier(0.4, 0, 0.2, 1)',
                style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('navItemAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)',
            style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('contentAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)',
            style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('pageAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms cubic-bezier(0.4, 0, 0.2, 1)',
            style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)',
            style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),
    trigger('calendarAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)',
            style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)',
            style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)',
            style({ opacity: 1 }))
      ])
    ])
  ]

})
export class App {
  showResults = false;
  showJobDescription = false;
  analysis: ResumeAnalysis | any;
  isSidebarCollapsed = false;
  currentPage = 'home';
  loading$: Observable<boolean>;

  constructor(private readonly resumeAnalysisService: ResumeAnalysisService ,
              private readonly dialog: MatDialog ,
              private readonly sharedService: SharedDataService,
              private readonly loaderService: LoaderService) {
    this.loading$ = this.loaderService.loading$;
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  navigateTo(page: string) {
    this.currentPage = page;
  }

  onFileUploaded() {
    this.showJobDescription = true;
  }

  onJobDescriptionAnalyzed() {
    this.getResults();
  }

  getResults(){
    this.loaderService.show();
    this.resumeAnalysisService.getResumeAnalysisReport(this.sharedService.getFile(),this.sharedService.getJD())
        .pipe(finalize(()=>this.loaderService.hide()))
        .subscribe((result:any) =>{
          this.analysis = result;
          this.showResults = true;
        })
  }
  getScoreColor(): string {
    if (this.analysis.overallScore >= 80) return '#4caf50';
    if (this.analysis.overallScore >= 60) return '#ff9800';
    return '#f44336';
  }

  getDummyDays(): number[] {
    return Array.from({ length: 31 }, (_, i) => i + 1);
  }

  downloadReport() {
    const report = `
Resume ATS Analysis Report
-------------------------
Overall Score: ${this.analysis.overallScore}/100

Section Scores:
${this.analysis.sections.map((section:any) => `
${section.name}: ${section.score}/100
Recommendations:
${section.recommendations.map((rec:any) => `- ${rec}`).join('\n')}`).join('\n')}

Keywords Found:
${this.analysis.foundKeywords.join(', ')}

Missing Keywords:
${this.analysis.missingKeywords.join(', ')}
    `;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume-ats-analysis.txt';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  scheduleReview() {
    const dialogRef = this.dialog.open(BookingDialogComponent, {
      width: '600px',
      data: { expertName: 'John Doe' } // Pass dynamic name if needed
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Booking form submitted:', result);
        // You can handle the result here (e.g., send to API)
      }
    });
  }
}

bootstrapApplication(App, {
  providers: [
    provideAnimations(), // 👈 Add this line
    provideHttpClient()
  ]
});