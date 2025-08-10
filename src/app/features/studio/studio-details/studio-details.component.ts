import { Component, inject, signal } from '@angular/core';
import { NZ_MODAL_DATA, NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { Studio } from '../studio.model';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-studio-details',
  imports: [CommonModule, NzModalModule, NzButtonModule],
  templateUrl: './studio-details.component.html',
  styleUrl: './studio-details.component.scss',
})
export class StudioDetailsComponent {
  private readonly modalData: { data: Studio } = inject(NZ_MODAL_DATA);
  private readonly nzModalRef = inject(NzModalRef);

  studio = signal<Studio>(this.modalData.data);

  close(): void {
    this.nzModalRef.close();
  }
}
