import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
    selector: 'app-loader',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="loader-overlay" [@fadeInOut]>
      <div class="loader-content">
        <div class="spinner">
          <div class="double-bounce1"></div>
          <div class="double-bounce2"></div>
        </div>
        <p class="loading-text">Loading...</p>
      </div>
    </div>
  `,
    styles: [`
    .loader-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.9);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      backdrop-filter: blur(5px);
    }

    .loader-content {
      text-align: center;
    }

    .loading-text {
      margin-top: 20px;
      color: #3f51b5;
      font-size: 1.2rem;
      font-weight: 500;
      animation: pulse 1.5s ease-in-out infinite;
    }

    .spinner {
      width: 60px;
      height: 60px;
      position: relative;
      margin: 0 auto;
    }

    .double-bounce1, .double-bounce2 {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #3f51b5;
      opacity: 0.6;
      position: absolute;
      top: 0;
      left: 0;
      animation: bounce 2.0s infinite ease-in-out;
    }

    .double-bounce2 {
      animation-delay: -1.0s;
    }

    @keyframes bounce {
      0%, 100% { 
        transform: scale(0.0);
      } 
      50% { 
        transform: scale(1.0);
      }
    }

    @keyframes pulse {
      0% {
        opacity: 0.6;
      }
      50% {
        opacity: 1;
      }
      100% {
        opacity: 0.6;
      }
    }
  `],
    animations: [
        trigger('fadeInOut', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('0.3s ease-out', style({ opacity: 1 }))
            ]),
            transition(':leave', [
                animate('0.3s ease-in', style({ opacity: 0 }))
            ])
        ])
    ]
})
export class LoaderComponent {}