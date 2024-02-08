import React, { useEffect } from "react";

const Instruction = ({ instruction }) => {
  useEffect(() => {}, [instruction]);

  return (
    <div style={{ margin: "10px 0", fontSize: "18px" }}>
      <strong>Step:</strong> {instruction}
    </div>
  );
};

export default Instruction;
