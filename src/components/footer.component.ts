import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <footer class="footer" [@fadeIn]>
      <div class="footer-content">
        <div class="contact-social">
          <span><mat-icon>email</mat-icon> daradil639&#64;gmail.com</span>
          <span><mat-icon>phone</mat-icon> +91 8825099693</span>
          <span><mat-icon>location_on</mat-icon> Kashmir, J&K</span>
        </div>
        <div class="social-links">
          <a href="https://github.com/Aadil-hussain9" target="_blank" class="social-link">
            <mat-icon>code</mat-icon> GitHub
          </a>
          <a href="https://linkedin.com/in/aadilhussain639/" target="_blank" class="social-link">
            <mat-icon>work</mat-icon> LinkedIn
          </a>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2025 Aadil Dar. All rights reserved.</p>
      </div>
    </footer>


  `,
  styles: [`
    .footer {
      background: #1a237e;
      color: white;
      padding: 12px 16px;
      font-size: 0.8rem;
    }

    .footer-content {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .contact-social {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      align-items: center;
      color: rgba(255, 255, 255, 0.8);
    }

    .contact-social span {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .contact-social mat-icon {
      font-size: 18px;
    }

    .social-links {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .social-link {
      display: flex;
      align-items: center;
      gap: 6px;
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      background: rgba(255, 255, 255, 0.1);
      padding: 6px 10px;
      border-radius: 20px;
      transition: background 0.3s ease;
    }

    .social-link:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .footer-bottom {
      text-align: center;
      margin-top: 10px;
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.75rem;
    }


  `],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class FooterComponent {
  navigate(page: string) {
    // Handle navigation
  }
}