import React from "react";

const MapInfo = ({ latitude, longitude, distance }) => {
  return (
    <div>
      <h3>Current location:</h3>
      <p>Latitude: {latitude}</p>
      <p>Longitude: {longitude}</p>
      <p>Distance between markers: {distance}meters</p>
    </div>
  );
};

export default MapInfo;
