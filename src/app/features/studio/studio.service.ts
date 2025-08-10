import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Studio } from './studio.model';
import { map, Observable } from 'rxjs';

@Injectable()
export class StudioService {
  private readonly http = inject(HttpClient);

  getStudios(): Observable<Studio[]> {
    return this.http.get<{ studios: Studio[] }>('assets/data/studio.json').pipe(map(response => response.studios));
  }
}
