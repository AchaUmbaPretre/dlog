export const getSpeedColor = (speed) => {
  if (speed <= 20) return 'green';
  if (speed <= 50) return 'orange';
  return 'red';
};