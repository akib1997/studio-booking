export function convertTimeStringToDate(timeString: string): Date | null {
  if (!timeString) return null;

  const today = new Date();
  const parts = timeString.split(':');
  if (parts.length < 2) return null;

  const hours = Number(parts[0]);
  const minutes = Number(parts[1]);

  if (
    isNaN(hours) || isNaN(minutes) ||
    hours < 0 || hours > 23 ||
    minutes < 0 || minutes > 59
  ) {
    return null;
  }

  return new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes);
}

