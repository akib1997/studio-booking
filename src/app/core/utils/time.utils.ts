/**
 * Time utility functions for consistent time formatting
 */
export class TimeUtils {
  /**
   * Format any time input to HH:mm string format (24-hour)
   * @param time - Date object, moment object, or string
   * @returns Formatted time string in HH:mm format
   */
  static formatTime(time: any): string {
    if (!time) return '';

    // Handle Date objects
    if (time instanceof Date) {
      return time.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    }

    // Handle moment.js or similar objects with format method
    if (time && typeof time.format === 'function') {
      return time.format('HH:mm');
    }

    // Handle string inputs
    if (typeof time === 'string') {
      // If already in HH:mm format, return as is
      if (time.match(/^\d{2}:\d{2}$/)) {
        return time;
      }

      // Handle HH:mm:ss format - extract HH:mm
      if (time.match(/^\d{2}:\d{2}:\d{2}$/)) {
        return time.substring(0, 5);
      }

      // Try to parse time strings like "8:30 PM" or "20:30"
      try {
        const parsed = new Date(`1970-01-01T${time}`);
        if (!isNaN(parsed.getTime())) {
          return parsed.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          });
        }
      } catch (e) {
        // Continue to fallback
      }
    }

    // Fallback to current time
    return new Date().toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }

  /**
   * Convert HH:mm time string to 12-hour format
   * @param timeString - Time string in HH:mm format
   * @returns Time string in 12-hour format (e.g., "8:30 PM")
   */
  static to12HourFormat(timeString: string): string {
    if (!timeString.match(/^\d{2}:\d{2}$/)) return timeString;

    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  }

  /**
   * Convert 12-hour format to HH:mm format
   * @param timeString - Time string in 12-hour format (e.g., "8:30 PM")
   * @returns Time string in HH:mm format
   */
  static to24HourFormat(timeString: string): string {
    const match = timeString.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return timeString;

    let [, hours, minutes, period] = match;
    let hour24 = parseInt(hours);

    if (period.toUpperCase() === 'PM' && hour24 !== 12) {
      hour24 += 12;
    } else if (period.toUpperCase() === 'AM' && hour24 === 12) {
      hour24 = 0;
    }

    return `${hour24.toString().padStart(2, '0')}:${minutes}`;
  }

  /**
   * Get current time in HH:mm format
   * @returns Current time string
   */
  static getCurrentTime(): string {
    return new Date().toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }

  /**
   * Check if time1 is after time2
   * @param time1 - First time in HH:mm format
   * @param time2 - Second time in HH:mm format
   * @returns boolean
   */
  static isTimeAfter(time1: string, time2: string): boolean {
    const [h1, m1] = time1.split(':').map(Number);
    const [h2, m2] = time2.split(':').map(Number);

    return h1 * 60 + m1 > h2 * 60 + m2;
  }

  /**
   * Check if time1 is before time2
   * @param time1 - First time in HH:mm format
   * @param time2 - Second time in HH:mm format
   * @returns boolean
   */
  static isTimeBefore(time1: string, time2: string): boolean {
    const [h1, m1] = time1.split(':').map(Number);
    const [h2, m2] = time2.split(':').map(Number);

    return h1 * 60 + m1 < h2 * 60 + m2;
  }

  /**
   * Add minutes to a time string
   * @param timeString - Time in HH:mm format
   * @param minutes - Minutes to add
   * @returns New time string in HH:mm format
   */
  static addMinutes(timeString: string, minutes: number): string {
    const [hours, mins] = timeString.split(':').map(Number);
    const totalMinutes = (hours * 60 + mins + minutes) % (24 * 60);
    const newHours = Math.floor(totalMinutes / 60);
    const newMins = totalMinutes % 60;

    return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`;
  }

  /**
   * Get time difference in minutes
   * @param startTime - Start time in HH:mm format
   * @param endTime - End time in HH:mm format
   * @returns Difference in minutes
   */
  static getTimeDifferenceInMinutes(startTime: string, endTime: string): number {
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);

    const startMinutes = sh * 60 + sm;
    const endMinutes = eh * 60 + em;

    return endMinutes - startMinutes;
  }

  /**
   * Check if a time is in the past for today
   * @param timeString - Time in HH:mm format
   * @returns boolean
   */
  static isPastTime(timeString: string): boolean {
    const currentTime = this.getCurrentTime();
    return this.isTimeBefore(timeString, currentTime);
  }

  /**
   * Generate time slots between start and end time
   * @param startTime - Start time in HH:mm format
   * @param endTime - End time in HH:mm format
   * @param intervalMinutes - Interval between slots in minutes
   * @returns Array of time strings
   */
  static generateTimeSlots(startTime: string, endTime: string, intervalMinutes: number = 30): string[] {
    const slots: string[] = [];
    let current = startTime;

    while (this.isTimeBefore(current, endTime) || current === endTime) {
      slots.push(current);
      current = this.addMinutes(current, intervalMinutes);
    }

    return slots;
  }
}
