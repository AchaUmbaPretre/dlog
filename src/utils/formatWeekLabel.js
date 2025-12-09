export const parseYearWeek = (yearWeek) => {
  const year = Math.floor(yearWeek / 100);
  const week = yearWeek % 100;
  return { year, week };
};

// Convertit l'année + semaine -> "S49 - Déc 2025"
export const formatWeekLabel = (yearWeek) => {
  const { year, week } = parseYearWeek(yearWeek);

  const date = new Date(year, 0, 1 + (week - 1) * 7);
  const month = date.toLocaleString("fr-FR", { month: "short" });

  return `S${week.toString().padStart(2, "0")} · ${month} ${date.getFullYear()}`;
};
