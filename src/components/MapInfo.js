import React from "react";

const MapInfo = ({ totalDistance, finalDestination }) => {
  return (
    <>
      <div>Total Distance: {totalDistance} meters</div>
      <div>Final Destination: {finalDestination}</div>
    </>
  );
};

export default MapInfo;
