import React from "react";

const Instruction = ({ instruction, distanceToNewManeuver }) => {
  return (
    <div className="m-y-2" style={{ fontSize: "18px" }}>
      <p>Step: {instruction}</p>
      <p className="text-red-600">
        Distance to new maneuver: {distanceToNewManeuver}m.
      </p>
    </div>
  );
};

export default Instruction;
