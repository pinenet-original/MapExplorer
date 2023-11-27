import React from "react";

const MapInfo = ({ totalDistance, finalDestination, coords }) => {
  console.log(coords);
  return (
    <>
      <div>Total Distance: {totalDistance} meters</div>
      <div>Final Destination: {finalDestination}</div>
      <div>
        My Coordinates:
        {coords.length > 0 && (
          <div>
            <p>latitude: {coords[0][0]}</p>
            <p>longtitude: {coords[0][1]}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default MapInfo;
