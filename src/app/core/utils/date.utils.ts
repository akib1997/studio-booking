/**
 * Date utility functions for consistent date/time formatting
 */
export class DateUtils {
  /**
   * Format any date input to YYYY-MM-DD string format
   * @param date - Date object, moment object, or string
   * @returns Formatted date string in YYYY-MM-DD format
   */
  static formatDate(date: any): string {
    if (!date) return '';

    // Handle Date objects
    if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    }

    // Handle moment.js or similar objects with format method
    if (date && typeof date.format === 'function') {
      return date.format('YYYY-MM-DD');
    }

    // Handle string inputs
    if (typeof date === 'string') {
      // If already in YYYY-MM-DD format, return as is
      if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return date;
      }

      // Try to parse and format string dates
      const parsed = new Date(date);
      if (!isNaN(parsed.getTime())) {
        return parsed.toISOString().split('T')[0];
      }
    }

    // Fallback to current date
    return new Date().toISOString().split('T')[0];
  }

  /**
   * Parse a date string and return Date object
   * @param dateString - Date string in YYYY-MM-DD format
   * @returns Date object
   */
  static parseDate(dateString: string): Date {
    return new Date(dateString);
  }

  /**
   * Check if a date string is today
   * @param dateString - Date string in YYYY-MM-DD format
   * @returns boolean
   */
  static isToday(dateString: string): boolean {
    const today = new Date().toISOString().split('T')[0];
    return dateString === today;
  }

  /**
   * Check if a date string is in the past
   * @param dateString - Date string in YYYY-MM-DD format
   * @returns boolean
   */
  static isPastDate(dateString: string): boolean {
    const today = new Date().toISOString().split('T')[0];
    return dateString < today;
  }

  /**
   * Get current date in YYYY-MM-DD format
   * @returns Current date string
   */
  static getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  /**
   * Add days to a date string
   * @param dateString - Date string in YYYY-MM-DD format
   * @param days - Number of days to add
   * @returns New date string
   */
  static addDays(dateString: string, days: number): string {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }

  /**
   * Get day of week from date string
   * @param dateString - Date string in YYYY-MM-DD format
   * @returns Day name (Monday, Tuesday, etc.)
   */
  static getDayOfWeek(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  }

  /**
   * Format date for display (e.g., "August 11, 2025")
   * @param dateString - Date string in YYYY-MM-DD format
   * @returns Formatted date string for display
   */
  static formatDateForDisplay(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
