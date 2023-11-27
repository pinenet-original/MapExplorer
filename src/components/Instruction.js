import React from "react";

const Instruction = ({ step, no_ }) => {
  return (
    <div className="flex justfy-start items-center gap-5">
      {no_}
      {step}
    </div>
  );
};

export default Instruction;
