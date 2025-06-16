import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {HttpClient} from "@angular/common/http";

export interface BookingNotification {
  expertName: string;
  date: string;
  time: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  baseUrl = 'http://localhost:8001';

  constructor(private http: HttpClient) {
    // This service can be extended to include more methods for booking management
  }
  private bookingSubject = new Subject<BookingNotification>();
  bookingNotification$ = this.bookingSubject.asObservable();

  notifyBooking(notification: BookingNotification) {
    this.bookingSubject.next(notification);
  }

  scheduleSession(data: any) {
    debugger
    return this.http.post(`${this.baseUrl}/api/bookings`, data); // replace with your backend URL
  }

}