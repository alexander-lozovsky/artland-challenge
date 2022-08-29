export const differenceInDays = (date1: Date, date2: Date) => {
    const timestamp1 = date1.getTime();
    const timestamp2 = date2.getTime();

    return Math.floor(Math.abs(timestamp1 - timestamp2) / (1000 * 60 * 60 * 24));
};
