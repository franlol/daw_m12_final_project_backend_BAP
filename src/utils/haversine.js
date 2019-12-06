// https://en.wikipedia.org/wiki/Haversine_formula
// https://en.wikipedia.org/wiki/Earth_radius

// Haversine Formula:
const distanceBetween = (zipcodeCoords, adCoords) => {
  const [zipcodeLat, zipcodeLon] = zipcodeCoords;
  const [adLat, adLon] = adCoords;
  const R = 6371;
  
  // Degrees to Radians
  const toRad = coord => coord * Math.PI / 180;

  const latDiff = toRad(adLat - zipcodeLat);
  const lonDiff = toRad(adLon - zipcodeLon);

  const zipcodeLatRads = toRad(zipcodeLat);
  const adLatRads = toRad(adLat);

  const a = Math.sin(latDiff / 2) * Math.sin(latDiff / 2) + Math.sin(lonDiff / 2) * Math.sin(lonDiff / 2) * Math.cos(zipcodeLatRads) * Math.cos(adLatRads);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

module.exports = distanceBetween;
