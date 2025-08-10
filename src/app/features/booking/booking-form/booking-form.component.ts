import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { Studio } from '../../studio/studio.model';

import { differenceInCalendarDays } from 'date-fns';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { BookingService } from '../booking.service';
import { DateUtils } from '../../../core/utils/date.utils';
import { TimeUtils } from '../../../core/utils/time.utils';

@Component({
  selector: 'app-booking-form',
  imports: [ReactiveFormsModule, NzButtonModule, NzFormModule, NzInputModule, NzModalModule, NzDatePickerModule, NzTimePickerModule, NzAlertModule],
  templateUrl: './booking-form.component.html',
  styleUrl: './booking-form.component.scss',
})
export class BookingFormComponent {
  private readonly modalData: { data: Studio } = inject(NZ_MODAL_DATA);

  private readonly destroyRef = inject(DestroyRef);
  private readonly nzModalRef = inject(NzModalRef);
  private readonly bookingService = inject(BookingService);
  private readonly nzNotificationService = inject(NzNotificationService);

  isSaving = signal(false);
  bookedError = signal<string | null>(null);

  getCurrentDateTime() {
    return new Date();
  }

  isSelectedDateToday(): boolean {
    const selectedDate = this.form.get('date')?.value;
    if (!selectedDate) return false;

    const today = new Date();
    const selected = selectedDate instanceof Date ? selectedDate : new Date(selectedDate);

    return selected.toDateString() === today.toDateString();
  }

  form: FormGroup = new FormGroup({
    date: new FormControl(null, { validators: [Validators.required] }),
    time: new FormControl(null, { validators: [Validators.required] }),
    name: new FormControl('John', { validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50)] }),
    email: new FormControl('maxigi6605@cronack.com', { validators: [Validators.required, Validators.email] }),
  });

  disabledDate = (current: Date): boolean => {
    const today = new Date();
    return differenceInCalendarDays(current, today) < 0;
  };

  disabledHours = (): number[] => {
    if (!this.isSelectedDateToday()) {
      return []; // No disabled hours if not today
    }

    const currentHour = new Date().getHours();
    const disabledHours: number[] = [];

    // Disable all hours before current hour
    for (let i = 0; i < currentHour; i++) {
      disabledHours.push(i);
    }

    return disabledHours;
  };

  // Disable minutes before current minute if date is today and hour is current hour
  disabledMinutes = (hour: number): number[] => {
    if (!this.isSelectedDateToday()) {
      return []; // No disabled minutes if not today
    }

    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();

    // If selected hour is current hour, disable minutes before current minute
    if (hour === currentHour) {
      const disabledMinutes: number[] = [];
      for (let i = 0; i <= currentMinute; i++) {
        disabledMinutes.push(i);
      }
      return disabledMinutes;
    }

    return []; // No disabled minutes for future hours
  };

  submitForm(): void {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach(control => {
        control.markAsDirty();
        control.updateValueAndValidity();
      });
      return;
    }

    const { date, time, name, email } = this.form.value;

    const dateStr = DateUtils.formatDate(date);
    const timeStr = TimeUtils.formatTime(time);

    // Now pass formatted strings
    if (!this.bookingService.isAvailable(this.modalData.data.Id, dateStr, timeStr)) {
      this.bookedError.set('Selected date and time are already booked.');
      return;
    }

    this.isSaving.set(true);

    // Store formatted strings
    this.bookingService.addBooking({
      ...this.modalData.data,
      studioId: this.modalData.data.Id,
      id: crypto.randomUUID(),
      date: dateStr,
      time: timeStr,
      name,
      email,
    });

    this.nzNotificationService.success(
      'Booking Successful',
      `Your booking for ${this.modalData.data.Name} on ${dateStr} at ${timeStr} has been confirmed.`
    );
    this.isSaving.set(false);

    this.cancel(true);
  }

  cancel(isUpdated: boolean) {
    this.nzModalRef.destroy(isUpdated);
  }
}
