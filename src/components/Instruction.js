import React from "react";

const Instruction = ({ instruction, distanceToNewManeuver }) => {
  return (
    <div className="m-y-2" style={{ fontSize: "18px" }}>
      <p>
        After {distanceToNewManeuver}m. {instruction}
      </p>
    </div>
  );
};

export default Instruction;
