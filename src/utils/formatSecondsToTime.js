export const formatSecondsToTime = (seconds) => {
        if (!seconds || isNaN(seconds)) return "—";
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${h}h ${m}min`;
      };