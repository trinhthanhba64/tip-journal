import React, { useState, useEffect } from "react";
import { Layout, Button, Typography, Dropdown, Menu } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useAuth } from "../hooks/use-auth-client";

const { Header } = Layout;
const { Title, Text } = Typography;

const truncate = (string) => {
  return string.length > 10
    ? `${string.slice(0, 6)}...${string.slice(-4)}`
    : string;
};

const AppHeader = () => {
  const [balance, setBalance] = useState(null);

  const { isAuthenticated, identity, principal, login, logout, ledgerActor } =
    useAuth();

  const userMenu = (
    <Menu>
      <div style={{ padding: "5px 12px" }}>
        <Text>balance: {balance} ICP</Text>
      </div>
      <Menu.Item key="logout" onClick={logout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  const getBalance = async () => {
    const balance = await ledgerActor.icrc1_balance_of({
      owner: identity.getPrincipal(),
      subaccount: [],
    });
    setBalance(Number(balance) / 100_000_000);
  };

  return (
    <Header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "white",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        padding: "0 120px",
      }}
    >
      <Title level={3} style={{ margin: 0, color: "#1890ff" }}>
        Tip Journal
      </Title>
      {isAuthenticated ? (
        <Dropdown overlay={userMenu} trigger={["click"]}>
          <Button
            icon={<UserOutlined />}
            size="large"
            onClick={() => {
              getBalance();
            }}
          >
            {truncate(principal)}
          </Button>
        </Dropdown>
      ) : (
        <Button type="primary" size="large" onClick={login}>
          Login
        </Button>
      )}
    </Header>
  );
};

export default AppHeader;
