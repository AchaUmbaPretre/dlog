// services/geocodeService.js
import axios from "axios";

export const reverseGeocode = async (lat, lng) => {
  try {
    const res = await axios.get("https://nominatim.openstreetmap.org/reverse", {
      params: { lat, lon: lng, format: "json", addressdetails: 1 },
    });
    return res.data.display_name || `${lat}, ${lng}`;
  } catch (error) {
    return `${lat}, ${lng}`;
  }
};

// --- Zone de geofencing (ex: Kinshasa) ---
export const zoneAutorisee = {
  latMin: -4.6,
  latMax: -4.3,
  lngMin: 15.1,
  lngMax: 15.5,
};