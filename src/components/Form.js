import React, { useState } from "react";

const Form = ({ button, handleClick }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const formManager = (e) => {
    e.preventDefault();
    handleClick(email, password);
  };

  return (
    <div>
      <form className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="rounded bg-[#50d71e] hover:bg-blue-600 text-white py-0 px-2"
          onClick={(e) => formManager(e)}
        >
          {button}
        </button>
      </form>
    </div>
  );
};

export default Form;
