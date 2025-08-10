export function createDisablePastTimeFunctions(selectedDate: Date | null) {
  const now = new Date();

  function isToday(date: Date | null): boolean {
    if (!date) return false;
    return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate();
  }

  const disabledHours = (): number[] => {
    if (!isToday(selectedDate)) return [];
    const currentHour = now.getHours();
    return Array.from({ length: currentHour }, (_, i) => i);
  };

  const disabledMinutes = (selectedHour: number): number[] => {
    if (!isToday(selectedDate)) return [];
    const currentHour = now.getHours();
    if (selectedHour === currentHour) {
      const currentMinute = now.getMinutes();
      return Array.from({ length: currentMinute }, (_, i) => i);
    }
    return [];
  };

  // Seconds disabling not needed for HH:mm format, return empty array
  const disabledSeconds = (_selectedHour: number, _selectedMinute: number): number[] => {
    return [];
  };

  return { disabledHours, disabledMinutes, disabledSeconds };
}
