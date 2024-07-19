import axios from "axios";

const getCoordinatesFromAddress = async (address) => {
   const apiKey = 'AIzaSyAUsXRUXnavthEq2krHHUjQU2P_KNswKbw';
   const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    if (response.data.status === "OK") {
      const location = response.data.results[0].geometry.location;
      return {
        latitude: location.lat,
        longitude: location.lng,
      };
    } else {
      console.error("Geocoding API error: ", response.data.status);
      return null;
    }
  } catch (error) {
    console.error("Geocoding API error: ", error);
    return null;
  }
};

export default getCoordinatesFromAddress;
