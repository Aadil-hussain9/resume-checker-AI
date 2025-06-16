import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NotificationComponent } from "./notification.component";
import { trigger, transition, style, animate } from '@angular/animations';
import { NativeDateAdapter } from '@angular/material/core';
import {BookingService} from "../services/booking.service";

// Custom date formats
export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-booking-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatIconModule,
    MatSnackBarModule,
    NotificationComponent
  ],
  providers: [
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' }
  ],
  template: `
    <div class="booking-dialog" [@dialogAnimation]>
      <h2 mat-dialog-title class="dialog-title">
        <mat-icon>event_available</mat-icon>
        Schedule Expert Review with {{data.expertName}}
      </h2>

      <div class="price-info" [@fadeIn]>
        <mat-icon>payments</mat-icon>
        <div class="price-details">
          <span class="price-amount">
            <span class="original-price">₹1,999</span>
           <span class="free-label">Free</span>
           </span>
          <div class="price-features">
            <div class="feature-item">
              <mat-icon>schedule</mat-icon>
              <span>1-hour one-on-one mentorship</span>
            </div>
            <div class="feature-item">
              <mat-icon>description</mat-icon>
              <span>Detailed resume feedback</span>
            </div>
            <div class="feature-item">
              <mat-icon>psychology</mat-icon>
              <span>Career guidance</span>
            </div>
          </div>
        </div>
      </div>

      <form [formGroup]="bookingForm" (ngSubmit)="onSubmit()" [@formAnimation]>
        <mat-dialog-content>
          <div class="form-grid">
            <mat-form-field appearance="outline" class="animate-field">
              <mat-label>Full Name</mat-label>
              <input matInput formControlName="name" placeholder="Enter your full name">
              <mat-icon matSuffix>person</mat-icon>
              <mat-error *ngIf="bookingForm.get('name')?.hasError('required')">
                Name is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="animate-field">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" placeholder="Enter your email">
              <mat-icon matSuffix>email</mat-icon>
              <mat-error *ngIf="bookingForm.get('email')?.hasError('required')">
                Email is required
              </mat-error>
              <mat-error *ngIf="bookingForm.get('email')?.hasError('email')">
                Enter a valid email
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="animate-field">
              <mat-label>Phone Number</mat-label>
              <input matInput formControlName="phone" placeholder="Enter your phone number">
              <mat-icon matSuffix>phone</mat-icon>
              <mat-error *ngIf="bookingForm.get('phone')?.hasError('required')">
                Phone number is required
              </mat-error>
              <mat-error *ngIf="bookingForm.get('phone')?.hasError('pattern')">
                Enter a valid 10-digit phone number
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="animate-field">
              <mat-label>Preferred Date</mat-label>
              <input matInput [matDatepicker]="picker" [min]="minDate" formControlName="date">
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
              <mat-error *ngIf="bookingForm.get('date')?.hasError('required')">
                Date is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="animate-field">
              <mat-label>Preferred Time</mat-label>
              <mat-select formControlName="time">
                <mat-option *ngFor="let slot of availableTimeSlots" [value]="slot.value">
                  {{slot.display}}
                </mat-option>
              </mat-select>
              <mat-icon matSuffix>schedule</mat-icon>
              <mat-error *ngIf="bookingForm.get('time')?.hasError('required')">
                Time is required
              </mat-error>
            </mat-form-field>
          </div>
        </mat-dialog-content>

        <mat-dialog-actions align="end" class="action-buttons">
          <button mat-stroked-button color="warn" (click)="onCancel()" type="button">
            <mat-icon>close</mat-icon>
            Cancel
          </button>
          <button mat-raised-button color="primary" type="submit" [disabled]="!bookingForm.valid">
            <mat-icon>check_circle</mat-icon>
            Schedule Session
          </button>
        </mat-dialog-actions>
      </form>

      <app-notification
        *ngIf="showNotification"
        [expertName]="data.expertName"
        [date]="scheduledDate"
        [time]="scheduledTime"
        [@notificationAnimation]>
      </app-notification>
    </div>
  `,
  styles: [`
    .booking-dialog {
      padding: 24px;
      border-radius: 16px;
      max-width: 800px;
      background: white;
      position: relative;
      overflow: hidden;
    }

    .dialog-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 24px;
      font-weight: 600;
      color: #1a237e;
      margin-bottom: 20px;
    }

    .dialog-title mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
      color: #3f51b5;
    }

    .price-info {
      background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
      padding: 24px;
      border-radius: 12px;
      display: flex;
      align-items: flex-start;
      gap: 16px;
      margin: 24px 0;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    .price-amount {
      font-size: 16px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .original-price {
      text-decoration: line-through;
      color: #888;
    }

    .free-label {
      color: #2e7d32; /* Material green */
      font-weight: bold;
    }


    .price-info mat-icon {
      color: #1976d2;
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .price-details {
      flex: 1;
    }

    .price-amount {
      font-size: 1.4rem;
      font-weight: 600;
      color: #1976d2;
      display: block;
      margin-bottom: 12px;
    }

    .price-features {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #555;
    }

    .feature-item mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #3f51b5;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
      margin-top: 24px;
    }

    .animate-field {
      width: 100%;
      transition: all 0.3s ease;
    }

    .animate-field:focus-within {
      transform: translateY(-2px);
    }

    .action-buttons {
      padding-top: 32px;
      display: flex;
      gap: 16px;
      margin-top: 16px;
      border-top: 1px solid #eee;
    }

    .action-buttons button {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 24px;
      border-radius: 24px;
      transition: all 0.3s ease;
    }

    .action-buttons button:hover:not([disabled]) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    @media (max-width: 600px) {
      .booking-dialog {
        padding: 16px;
      }

      .form-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .price-info {
        flex-direction: column;
        padding: 16px;
      }

      .action-buttons {
        flex-direction: column;
      }

      .action-buttons button {
        width: 100%;
      }
    }
  `],
  animations: [
    trigger('dialogAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)',
            style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)',
            style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('formAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms 200ms cubic-bezier(0.4, 0, 0.2, 1)',
            style({ opacity: 1 }))
      ])
    ]),
    trigger('notificationAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-100%)' }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)',
            style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class BookingDialogComponent {
  bookingForm: FormGroup;
  showNotification = false;
  scheduledDate!: string;
  scheduledTime!: string;
  minDate = new Date();
  availableTimeSlots = [
    { value: '09:00', display: '09:00 AM' },
    { value: '11:00', display: '11:00 AM' },
    { value: '14:00', display: '02:00 PM' },
    { value: '16:00', display: '04:00 PM' }
  ];

  constructor(
      private dialogRef: MatDialogRef<BookingDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: { expertName: string },
      private fb: FormBuilder,
      private dateAdapter: DateAdapter<Date>,
        private bookingService: BookingService,
  ) {
    this.bookingForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      date: ['', Validators.required],
      time: ['', Validators.required]
    });

    // Set the locale for the date adapter
    this.dateAdapter.setLocale('en-US');
  }

  onSubmit() {
    if (this.bookingForm.valid) {
      debugger
      const { date, time } = this.bookingForm.value;
      this.scheduledDate = new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      this.scheduledTime = this.availableTimeSlots.find(slot => slot.value === time)?.display || time;
      this.showNotification = true;

        // Simulate a booking submission
      this.bookingService.scheduleSession(this.bookingForm.value).subscribe({
        next: () => console.log('Booking email sent'),
        error: (err:any) => console.error('Failed to send booking email', err)
      });

      setTimeout(() => {
        this.showNotification = false;
        this.dialogRef.close(this.bookingForm.value);
      }, 3000);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}