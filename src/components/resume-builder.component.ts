import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { trigger, transition, style, animate, stagger, query } from '@angular/animations';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-resume-builder',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatDividerModule,
    MatChipsModule,
    MatSelectModule,
    MatTooltipModule
  ],
  template: `
    <div class="resume-builder-container">
      <div class="resume-form" [formGroup]="resumeForm" [@formAnimation]>
        <h2 class="section-title">
          <mat-icon>description</mat-icon>
          Resume Builder
        </h2>
        
        <!-- Theme Selection -->
        <div class="form-section theme-selector">
          <h3>
            <mat-icon>palette</mat-icon>
            Choose Theme
          </h3>
          <mat-form-field appearance="outline">
            <mat-label>Resume Theme</mat-label>
            <mat-select formControlName="theme">
              <mat-option value="modern">Modern</mat-option>
              <mat-option value="classic">Classic</mat-option>
              <mat-option value="minimal">Minimal</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <!-- Personal Information -->
        <div class="form-section" [@sectionAnimation]>
          <h3>
            <mat-icon>person</mat-icon>
            Personal Information
          </h3>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Full Name</mat-label>
            <input matInput formControlName="fullName" placeholder="e.g., ADIL DAR">
            <mat-icon matSuffix>badge</mat-icon>
          </mat-form-field>

          <div class="contact-info">
            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" placeholder="e.g., example@email.com">
              <mat-icon matSuffix>email</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Phone</mat-label>
              <input matInput formControlName="phone" placeholder="e.g., +91 1234567890">
              <mat-icon matSuffix>phone</mat-icon>
            </mat-form-field>
          </div>
        </div>

        <!-- Skills -->
        <div class="form-section" formGroupName="skills" [@sectionAnimation]>
          <h3>
            <mat-icon>psychology</mat-icon>
            Skills
          </h3>
          
          <div class="skill-category" *ngFor="let category of skillCategories">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>{{category}}</mat-label>
              <input matInput [formControlName]="category.toLowerCase().replace(' ', '')" 
                     [placeholder]="'Enter ' + category + ' skills'">
              <mat-icon matSuffix>stars</mat-icon>
            </mat-form-field>
          </div>
        </div>

        <!-- Experience -->
        <div class="form-section" [@sectionAnimation]>
          <h3>
            <mat-icon>work</mat-icon>
            Experience
          </h3>
          <div formArrayName="experience">
            <div *ngFor="let exp of experienceArray.controls; let i=index" 
                 [formGroupName]="i" 
                 class="experience-entry"
                 [@itemAnimation]>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Company Name</mat-label>
                <input matInput formControlName="company">
                <mat-icon matSuffix>business</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Position</mat-label>
                <input matInput formControlName="position">
                <mat-icon matSuffix>work_outline</mat-icon>
              </mat-form-field>

              <div class="date-location">
                <mat-form-field appearance="outline">
                  <mat-label>Start Date</mat-label>
                  <input matInput formControlName="startDate">
                  <mat-icon matSuffix>event</mat-icon>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>End Date</mat-label>
                  <input matInput formControlName="endDate">
                  <mat-icon matSuffix>event</mat-icon>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Location</mat-label>
                  <input matInput formControlName="location">
                  <mat-icon matSuffix>location_on</mat-icon>
                </mat-form-field>
              </div>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Responsibilities</mat-label>
                <textarea matInput formControlName="responsibilities" rows="4"
                          placeholder="Enter responsibilities (one per line)"></textarea>
                <mat-icon matSuffix>assignment</mat-icon>
              </mat-form-field>

              <button mat-icon-button color="warn" (click)="removeExperience(i)"
                      *ngIf="experienceArray.length > 1"
                      matTooltip="Remove Experience">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          </div>

          <button mat-raised-button color="primary" (click)="addExperience()" class="add-button">
            <mat-icon>add</mat-icon> Add Experience
          </button>
        </div>

        <!-- Projects -->
        <div class="form-section" [@sectionAnimation]>
          <h3>
            <mat-icon>rocket_launch</mat-icon>
            Projects
          </h3>
          <div formArrayName="projects">
            <div *ngFor="let project of projectsArray.controls; let i=index" 
                 [formGroupName]="i" 
                 class="project-entry"
                 [@itemAnimation]>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Project Name</mat-label>
                <input matInput formControlName="name">
                <mat-icon matSuffix>folder</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Description</mat-label>
                <textarea matInput formControlName="description" rows="3"></textarea>
                <mat-icon matSuffix>description</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Technologies Used</mat-label>
                <input matInput formControlName="technologies">
                <mat-icon matSuffix>code</mat-icon>
              </mat-form-field>

              <button mat-icon-button color="warn" (click)="removeProject(i)"
                      *ngIf="projectsArray.length > 1"
                      matTooltip="Remove Project">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          </div>

          <button mat-raised-button color="primary" (click)="addProject()" class="add-button">
            <mat-icon>add</mat-icon> Add Project
          </button>
        </div>

        <!-- Education -->
        <div class="form-section" [@sectionAnimation]>
          <h3>
            <mat-icon>school</mat-icon>
            Education
          </h3>
          <div formArrayName="education">
            <div *ngFor="let edu of educationArray.controls; let i=index" 
                 [formGroupName]="i" 
                 class="education-entry"
                 [@itemAnimation]>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Institution</mat-label>
                <input matInput formControlName="institution">
                <mat-icon matSuffix>account_balance</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Degree</mat-label>
                <input matInput formControlName="degree">
                <mat-icon matSuffix>school</mat-icon>
              </mat-form-field>

              <div class="date-score">
                <mat-form-field appearance="outline">
                  <mat-label>Start Date</mat-label>
                  <input matInput formControlName="startDate">
                  <mat-icon matSuffix>event</mat-icon>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>End Date</mat-label>
                  <input matInput formControlName="endDate">
                  <mat-icon matSuffix>event</mat-icon>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Score</mat-label>
                  <input matInput formControlName="score" type="number">
                  <mat-icon matSuffix>grade</mat-icon>
                </mat-form-field>
              </div>

              <button mat-icon-button color="warn" (click)="removeEducation(i)"
                      *ngIf="educationArray.length > 1"
                      matTooltip="Remove Education">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          </div>

          <button mat-raised-button color="primary" (click)="addEducation()" class="add-button">
            <mat-icon>add</mat-icon> Add Education
          </button>
        </div>

        <!-- Links -->
        <div class="form-section" [@sectionAnimation]>
          <h3>
            <mat-icon>link</mat-icon>
            Links
          </h3>
          <div formGroupName="links">
            <mat-form-field appearance="outline">
              <mat-label>GitHub</mat-label>
              <input matInput formControlName="github">
              <mat-icon matSuffix>code</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>LinkedIn</mat-label>
              <input matInput formControlName="linkedin">
              <mat-icon matSuffix>people</mat-icon>
            </mat-form-field>
          </div>
        </div>

        <div class="form-actions">
          <button mat-raised-button color="primary" (click)="generatePDF()" 
                  [disabled]="!resumeForm.valid"
                  class="export-button">
            <mat-icon>picture_as_pdf</mat-icon>
            Export to PDF
          </button>
        </div>
      </div>

      <!-- Preview Section -->
      <div class="resume-preview" #resumePreview [ngClass]="resumeForm.get('theme')?.value">
        <div class="preview-header">
          <h1>{{resumeForm.get('fullName')?.value}}</h1>
          <p>{{resumeForm.get('email')?.value}} | {{resumeForm.get('phone')?.value}}</p>
        </div>

        <div class="preview-section">
          <h2>SKILLS</h2>
          <div *ngFor="let category of skillCategories">
            <p><strong>{{category}}:</strong> {{resumeForm.get('skills')?.get(category.toLowerCase().replace(' ', ''))?.value}}</p>
          </div>
        </div>

        <div class="preview-section">
          <h2>EXPERIENCE</h2>
          <div *ngFor="let exp of experienceArray.controls">
            <h3>{{exp.get('company')?.value}}</h3>
            <p>{{exp.get('position')?.value}}</p>
            <p>{{exp.get('startDate')?.value}} - {{exp.get('endDate')?.value}} | {{exp.get('location')?.value}}</p>
            <ul>
              <li *ngFor="let responsibility of exp.get('responsibilities')?.value.split('\n')">
                {{responsibility}}
              </li>
            </ul>
          </div>
        </div>

        <div class="preview-section">
          <h2>PROJECTS</h2>
          <div *ngFor="let project of projectsArray.controls">
            <h3>{{project.get('name')?.value}}</h3>
            <p>{{project.get('description')?.value}}</p>
            <p><strong>Technologies:</strong> {{project.get('technologies')?.value}}</p>
          </div>
        </div>

        <div class="preview-section">
          <h2>EDUCATION</h2>
          <div *ngFor="let edu of educationArray.controls">
            <h3>{{edu.get('institution')?.value}}</h3>
            <p>{{edu.get('degree')?.value}}</p>
            <p>{{edu.get('startDate')?.value}} - {{edu.get('endDate')?.value}} | Score: {{edu.get('score')?.value}}%</p>
          </div>
        </div>

        <div class="preview-section">
          <h2>LINKS</h2>
          <p>GitHub: {{resumeForm.get('links')?.get('github')?.value}}</p>
          <p>LinkedIn: {{resumeForm.get('links')?.get('linkedin')?.value}}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .resume-builder-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
      gap: 30px;
      padding: 20px;
      max-width: 100%;
    }

    @media (max-width: 1024px) {
      .resume-builder-container {
        grid-template-columns: 1fr;
      }
    }

    .resume-form {
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      height: fit-content;
    }

    .form-section {
      margin-bottom: 30px;
      padding: 20px;
      border-radius: 8px;
      background: #f8f9fa;
      transition: all 0.3s ease;
    }

    .form-section:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    .form-section h3 {
      color: #333;
      margin-bottom: 20px;
      border-bottom: 2px solid #3f51b5;
      padding-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .form-section h3 mat-icon {
      color: #3f51b5;
    }

    .full-width {
      width: 100%;
    }

    .contact-info, .date-location, .date-score {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }

    .experience-entry, .project-entry, .education-entry {
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      position: relative;
      transition: all 0.3s ease;
      border: 1px solid #e0e0e0;
    }

    .experience-entry:hover, .project-entry:hover, .education-entry:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      border-color: #3f51b5;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 30px;
    }

    .resume-preview {
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      height: fit-content;
      position: sticky;
      top: 20px;
    }

    .preview-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .preview-section {
      margin-bottom: 25px;
    }

    .preview-section h2 {
      color: #3f51b5;
      border-bottom: 2px solid #3f51b5;
      padding-bottom: 5px;
      margin-bottom: 15px;
    }

    .preview-section ul {
      margin-left: 20px;
    }

    .preview-section li {
      margin-bottom: 5px;
    }

    button[mat-icon-button] {
      position: absolute;
      top: 10px;
      right: 10px;
    }

    .mat-mdc-form-field {
      margin-bottom: 15px;
    }

    .add-button {
      width: 100%;
      margin-top: 10px;
      transition: all 0.3s ease;
    }

    .add-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(63, 81, 181, 0.3);
    }

    .export-button {
      padding: 10px 20px;
      font-size: 16px;
      transition: all 0.3s ease;
    }

    .export-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(63, 81, 181, 0.3);
    }

    /* Theme Styles */
    .modern h1, .modern h2, .modern h3 {
      font-family: 'Roboto', sans-serif;
      color: #2196F3;
    }

    .classic h1, .classic h2, .classic h3 {
      font-family: 'Times New Roman', serif;
      color: #000;
    }

    .minimal h1, .minimal h2, .minimal h3 {
      font-family: 'Arial', sans-serif;
      color: #333;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #3f51b5;
      margin-bottom: 30px;
    }

    .section-title mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
    }
  `],
  animations: [
    trigger('formAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('sectionAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate('500ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('itemAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class ResumeBuilderComponent {
  resumeForm: FormGroup;
  skillCategories = [
    'Backend Development',
    'Data Pipelines',
    'Frontend Development',
    'Miscellaneous',
    'Soft Skills'
  ];

  constructor(private fb: FormBuilder) {
    this.resumeForm = this.fb.group({
      theme: ['modern'],
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      skills: this.fb.group({
        backenddevelopment: [''],
        datapipelines: [''],
        frontenddevelopment: [''],
        miscellaneous: [''],
        softskills: ['']
      }),
      experience: this.fb.array([this.createExperience()]),
      projects: this.fb.array([this.createProject()]),
      education: this.fb.array([this.createEducation()]),
      links: this.fb.group({
        github: [''],
        linkedin: ['']
      })
    });
  }

  get experienceArray() {
    return this.resumeForm.get('experience') as FormArray;
  }

  get projectsArray() {
    return this.resumeForm.get('projects') as FormArray;
  }

  get educationArray() {
    return this.resumeForm.get('education') as FormArray;
  }

  createExperience() {
    return this.fb.group({
      company: ['', Validators.required],
      position: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      location: ['', Validators.required],
      responsibilities: ['', Validators.required]
    });
  }

  createProject() {
    return this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      technologies: ['', Validators.required]
    });
  }

  createEducation() {
    return this.fb.group({
      institution: ['', Validators.required],
      degree: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      score: ['', [Validators.required, Validators.min(0), Validators.max(100)]]
    });
  }

  addExperience() {
    this.experienceArray.push(this.createExperience());
  }

  removeExperience(index: number) {
    this.experienceArray.removeAt(index);
  }

  addProject() {
    this.projectsArray.push(this.createProject());
  }

  removeProject(index: number) {
    this.projectsArray.removeAt(index);
  }

  addEducation() {
    this.educationArray.push(this.createEducation());
  }

  removeEducation(index: number) {
    this.educationArray.removeAt(index);
  }

  generatePDF() {
    const doc = new jsPDF();
    const content = this.resumeForm.value;
    
    // Header
    doc.setFontSize(20);
    doc.text(content.fullName, 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`${content.email} | ${content.phone}`, 105, 30, { align: 'center' });

    // Skills
    doc.setFontSize(16);
    doc.text('SKILLS', 20, 45);
    let yPos = 55;
    Object.entries(content.skills).forEach(([key, value]) => {
      doc.setFontSize(12);
      doc.text(`${key}: ${value}`, 20, yPos);
      yPos += 10;
    });

    // Experience
    yPos += 10;
    doc.setFontSize(16);
    doc.text('EXPERIENCE', 20, yPos);
    content.experience.forEach((exp: any) => {
      yPos += 10;
      doc.setFontSize(14);
      doc.text(exp.company, 20, yPos);
      yPos += 7;
      doc.setFontSize(12);
      doc.text(`${exp.position} | ${exp.startDate} - ${exp.endDate}`, 20, yPos);
      yPos += 7;
      doc.text(exp.location, 20, yPos);
      yPos += 7;
      exp.responsibilities.split('\n').forEach((resp: string) => {
        doc.text(`• ${resp}`, 25, yPos);
        yPos += 7;
      });
    });

    doc.save('resume.pdf');
  }
}