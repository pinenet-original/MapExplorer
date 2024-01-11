import Header from "@/components/Header";
import React from "react";

function IndexLayout({ children }) {
  return (
    <div className="main-layout">
      <Header />
      {children}
    </div>
  );
}

export default IndexLayout;
