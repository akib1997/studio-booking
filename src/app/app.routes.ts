import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', redirectTo: 'studios', pathMatch: 'full' }, // ✅ redirect only here
      {
        path: 'studios',
        loadComponent: () => import('./features/studio/studio-list/studio-list.component').then(m => m.StudioListComponent),
        title: 'Studios',
      },
      {
        path: 'bookings',
        loadComponent: () => import('./features/booking/booking-list/booking-list.component').then(m => m.BookingListComponent),
        title: 'Bookings',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
