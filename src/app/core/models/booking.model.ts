import { Studio } from '../../features/studio/studio.model';

export interface Booking extends Partial<Studio> {
  id: string;
  date: string;
  time: string;
  name: string;
  email: string;
  studioId: number;
}
