import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NotAvailablePipe } from '../../../core/pipes/not-available.pipe';
import { convertTimeStringToDate } from '../../../core/utils/date-time.utils';
import { BookingService } from '../booking.service';

@Component({
  selector: 'app-booking-list',
  imports: [
    CommonModule,
    NzTableModule,
    NzModalModule,
    NzSpinModule,
    NzSelectModule,
    NzAutocompleteModule,
    NzInputModule,
    FormsModule,
    NotAvailablePipe,
    DatePipe,
  ],
  templateUrl: './booking-list.component.html',
  styleUrl: './booking-list.component.scss',
  providers: [DatePipe],
})
export class BookingListComponent {
  private readonly bookingService = inject(BookingService);
  private readonly datePipe = inject(DatePipe);
  bookings = this.bookingService.bookings;

  getFormattedTime(timeString: string): string {
    const date = convertTimeStringToDate(timeString);
    if (!date) return 'N/A';
    return this.datePipe.transform(date, 'HH:mm') || 'N/A';
  }
}
