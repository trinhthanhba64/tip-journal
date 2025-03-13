import React from "react";
import { Layout } from "antd";

const { Content } = Layout;
const AppContent = ({ children }) => {
  return (
    <Content
      style={{
        padding: "24px 120px",
        minHeight: "calc(100vh - 64px)",
        background: "#f0f2f5",
      }}
    >
      {children}
    </Content>
  );
};

export default AppContent;
