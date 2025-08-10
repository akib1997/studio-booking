import { Injectable, signal, effect } from '@angular/core';
import { Booking } from './booking.model';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private STORAGE_KEY = 'bookings';

  bookings = signal<Booking[]>(this.loadFromStorage());

  constructor() {
    effect(() => {
      const currentBookings = this.bookings();
      this.saveToStorage(currentBookings);
    });
  }

  private loadFromStorage(): Booking[] {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  }

  private saveToStorage(bookings: Booking[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(bookings));
  }

  addBooking(booking: Booking): void {
    this.bookings.update(current => [...current, booking]);
  }

  isAvailable(studioId: number, date: string, time: string): boolean {
    const matchingBookings = this.bookings().filter(b => {
      return b.studioId === studioId && b.date === date && b.time === time;
    });

    return matchingBookings.length === 0;
  }

  getBookingsForStudio(studioId: number): Booking[] {
    return this.bookings().filter(b => b.studioId === studioId);
  }
}
