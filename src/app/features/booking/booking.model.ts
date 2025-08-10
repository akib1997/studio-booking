import { Studio } from '../studio/studio.model';

export interface Booking extends Partial<Studio> {
  id: string;
  date: string;
  time: string;
  name: string;
  email: string;
  studioId: number;
}
