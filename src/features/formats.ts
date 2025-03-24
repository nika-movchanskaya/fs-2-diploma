export const getMinutesText = (duration: number) => {
    if (duration % 100 >= 11 && duration % 100 <= 19) {
      return `${duration} минут `;
    }
    const lastDigit = duration % 10;
    if (lastDigit === 1) {
      return `${duration} минута `;
    }
    if (lastDigit >= 2 && lastDigit <= 4) {
      return `${duration} минуты `;
    }
    return `${duration} минут `;
};
