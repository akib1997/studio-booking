import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'notAvailable',
})
export class NotAvailablePipe implements PipeTransform {
  private readonly notAvailable = 'N/A';
  transform(value: any, ...args: unknown[]): unknown {
    if (value === 0) {
      return '0';
    }
    if (Array.isArray(value) && value.length === 0) {
      return this.notAvailable;
    }

    return value || this.notAvailable;
  }
}
