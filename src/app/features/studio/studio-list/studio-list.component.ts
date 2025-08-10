import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';
import { Studio } from '../studio.model';
import { StudioService } from '../studio.service';

import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NotAvailablePipe } from '../../../core/pipes/not-available.pipe';
import { getDistanceInKm } from '../../../core/utils/distance.utils';
import { BookingFormComponent } from '../../booking/booking-form/booking-form.component';

@Component({
  selector: 'app-studio-list',
  imports: [NzTableModule, NzModalModule, NzSpinModule, NzSelectModule, NzAutocompleteModule, NzInputModule, FormsModule, NotAvailablePipe],
  templateUrl: './studio-list.component.html',
  styleUrl: './studio-list.component.scss',
  providers: [StudioService],
})
export class StudioListComponent {
  private readonly studioService = inject(StudioService);
  private readonly nzNotificationService = inject(NzNotificationService);
  private readonly nzModalService = inject(NzModalService);
  private readonly destroyRef = inject(DestroyRef);

  private locationOptions = signal<string[]>([]);
  protected filteredOptions = signal<string[]>([]);
  protected locationInput = signal<string>('');
  protected radiusSelect = signal<string>('');
  protected isLoading = signal(true);
  radiusOptions = signal([5, 10, 20, 50]);


  private studios = signal<Studio[]>([]);
  protected filteredStudios = computed(() => {
    const searchTerm = this.locationInput().toLowerCase();
    const radius = this.radiusSelect();

    // Default reference point (Dhaka city center)
    const DEFAULT_REF = { lat: 23.8103, lng: 90.4125 };

    let refLat: number;
    let refLng: number;

    if (searchTerm) {
      const match = this.studios().find(
        s => s.Location.Area.toLowerCase().includes(searchTerm) || s.Location.City.toLowerCase().includes(searchTerm)
      );
      if (match) {
        refLat = match.Location.Coordinates.Latitude;
        refLng = match.Location.Coordinates.Longitude;
      } else {
        // No matching location found, fallback to default
        refLat = DEFAULT_REF.lat;
        refLng = DEFAULT_REF.lng;
      }
    } else {
      // No search term, fallback to default center for radius filtering
      refLat = DEFAULT_REF.lat;
      refLng = DEFAULT_REF.lng;
    }

    return this.studios().filter(studio => {
      const matchesLocation =
        !searchTerm || studio.Location.Area.toLowerCase().includes(searchTerm) || studio.Location.City.toLowerCase().includes(searchTerm);

      const matchesRadius =
        !radius || getDistanceInKm(refLat, refLng, studio.Location.Coordinates.Latitude, studio.Location.Coordinates.Longitude) <= Number(radius);

      // Both filters must pass
      return matchesLocation && matchesRadius;
    });
  });

  ngOnInit() {
    this.loadStudios();
  }

  protected onSearchByLocation(value: string): void {
    const searchParams = value.trim().toLowerCase();
    const filteredOptions = this.locationOptions().filter(loc => loc.toLowerCase().includes(searchParams));
    this.filteredOptions.set(filteredOptions);
  }

  protected bookStudio(data: Studio) {
    console.log('Booking studio:', data);
    const modal = this.nzModalService.create({
      nzTitle: 'Studio Booking',
      nzWidth: 700,
      nzStyle: { top: '50px' },
      nzClassName: 'race-modal',
      nzContent: BookingFormComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzData: {
        data,
      },
    });
  }

  protected loadStudios() {
    this.isLoading.set(true);
    this.studioService
      .getStudios()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: studios => {
          this.studios.set(studios);

          const locations = new Set<string>();

          studios.forEach(s => {
            locations.add(s.Location.City);
            locations.add(s.Location.Area);
          });
          this.locationOptions.set(Array.from(locations));
        },
        error: error => {
          this.nzNotificationService.error('Error', 'Failed to load studios');
          console.error('Error loading studios:', error);
        },
      });
  }
}
