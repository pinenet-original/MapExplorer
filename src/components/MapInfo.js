import React from "react";

const MapInfo = ({ latitude, longitude }) => {
  return (
    <div>
      <h3>Marker current location:</h3>
      <p>Latitude: {latitude}</p>
      <p>Longitude: {longitude}</p>
      <p>Distance between markers: meters</p>
    </div>
  );
};

export default MapInfo;
