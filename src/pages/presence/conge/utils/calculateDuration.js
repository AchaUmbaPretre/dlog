export const calculateDuration = (start, end) => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    // +1 pour inclure le dernier jour
    return Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
};
