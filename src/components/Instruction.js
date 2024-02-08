import React from "react";

const Instruction = ({ instruction, distanceToNewManeuver }) => {
  return (
    <div style={{ margin: "10px 0", fontSize: "18px" }}>
      <p>Step: {instruction}</p>
      <p>Distance to new maneuver: {distanceToNewManeuver}m.</p>
    </div>
  );
};

export default Instruction;
