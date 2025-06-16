import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="notification" [@fadeIn]>
      <div class="notification-icon">
        <mat-icon>event_available</mat-icon>
      </div>
      <div class="notification-content">
        <h3>Booking Confirmed!</h3>
        <p>Your session with {{ expertName }} has been scheduled for {{ date }} at {{ time }}</p>
        <p class="notification-info">Check your email for further details</p>
      </div>
    </div>
  `,
  styles: [`
    .notification {
      position: fixed;
      top: 20px;
      right: 20px;
      background: white;
      border-radius: 12px;
      padding: 20px;
      display: flex;
      align-items: flex-start;
      gap: 15px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      max-width: 400px;
      z-index: 1000;
      transition: all 0.3s ease-in-out;
    }

    @media (max-width: 600px) {
      .notification {
        top: 10px;
        right: 10px;
        padding: 16px;
        max-width: 90%;
      }
    }

    .notification-icon {
      background: #4caf50;
      color: white;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .notification-content {
      flex: 1;
    }

    .notification-content h3 {
      margin: 0 0 5px;
      color: #333;
    }

    .notification-content p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }

    .notification-info {
      margin-top: 10px !important;
      color: #1976d2 !important;
      font-weight: 500;
    }
  `],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('150ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ])
  ]
})
export class NotificationComponent {
  @Input() expertName!: string;
  @Input() date!: string;
  @Input() time!: string;
}
