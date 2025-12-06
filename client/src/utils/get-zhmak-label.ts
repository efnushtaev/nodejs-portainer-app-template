export const getZhamLabel = (count: number): string => {
  const lastTwoDigits = count % 100;
  const lastDigit = count % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return 'Жмаков';
  }

  switch (lastDigit) {
    case 1:
      return 'Жмак';
    case 2:
    case 3:
    case 4:
      return 'Жмака';
    default:
      return 'Жмаков';
  }
}