let addressCache = {};

try {
  const stored = localStorage.getItem("vehicleAddressCache");
  if (stored) {
    addressCache = JSON.parse(stored);
  }
} catch (e) {
  console.warn("Erreur lecture cache localStorage", e);
}

export const getCache = () => addressCache;

export const setCache = (key, value) => {
  addressCache[key] = value;
  try {
    localStorage.setItem("vehicleAddressCache", JSON.stringify(addressCache));
  } catch (e) {}
};

export default addressCache;
