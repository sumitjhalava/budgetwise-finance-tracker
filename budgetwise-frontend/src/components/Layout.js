import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useUI } from "../contexts/UIContext";

const Layout = ({ children, title }) => {
  const { toggleSidebar } = useUI();

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Topbar title={title} toggleSidebar={toggleSidebar} />
        <main style={{ padding: "20px" }}>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
