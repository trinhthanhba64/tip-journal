import React, { useEffect, useState } from "react";
import {
  List,
  Button,
  Input,
  message,
  Card,
  Typography,
  Modal,
  Space,
} from "antd";
import CreatePost from "./CreatePost";
import { tip_journal_backend as backend } from "../../../declarations/tip_journal_backend";
import {
  ClockCircleOutlined,
  UserOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";
import { useAuth } from "../hooks/use-auth-client";

const { Title, Text } = Typography;
const PostList = () => {
  const { isAuthenticated, identity, login, ledgerActor } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTipModalOpen, setIsTipModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [tipAmount, setTipAmount] = useState(null);
  const [balance, setBalance] = useState(null);

  const fetchPosts = async () => {
    setLoading(true);
    const res = await backend.getPosts();
    setLoading(false);
    if (res.err) {
      console.log(res.err);
      return;
    }
    setPosts(res.ok);
  };

  const getBalance = async () => {
    const balance = await ledgerActor.icrc1_balance_of({
      owner: identity.getPrincipal(),
      subaccount: [],
    });
    setBalance(Number(balance) / 100_000_000);
  };

  const handleTip = async () => {
    if (!tipAmount) {
      message.error("Please enter tip amount.");
      return;
    }
    try {
      const transferArgs = {
        to: {
          owner: selectedPost.author,
          subaccount: [],
        },
        amount: BigInt(100_000_000 * tipAmount),
        fee: [],
        memo: [],
        from_subaccount: [],
        created_at_time: [],
      };
      const result = await ledgerActor.icrc1_transfer(transferArgs);
      console.log("Transfer Result:", result);
      setTipAmount(null);
      setSelectedPost(null);
      setIsTipModalOpen(false);
      message.success("Success!");
    } catch (error) {
      console.log(error);
      message.error("Error!");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const renderDate = (post) => {
    return `Created at: ${new Date(
      Number(post.created_at) / 1_000_000
    ).toLocaleString()}`;
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <Title level={2}>📝 List Journal</Title>
        <Button
          type="primary"
          onClick={() => {
            if (!isAuthenticated) {
              login();
              return;
            }
            setIsCreateModalOpen(true);
          }}
        >
          Create
        </Button>
      </div>
      <List
        loading={loading}
        dataSource={posts}
        renderItem={(post) => (
          <List.Item key={post.id}>
            <Card
              style={{
                width: "100%",
                borderRadius: "8px",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
              }}
            >
              <Title level={4} style={{ marginTop: 0 }}>
                {post.title}
              </Title>
              <Text style={{ whiteSpace: "break-spaces" }}>{post.content}</Text>
              <div
                style={{ marginTop: "10px", color: "gray", fontSize: "12px" }}
              >
                <Space>
                  <UserOutlined />
                  {`Author: ${post.author.toString()}`}
                </Space>
              </div>
              <div
                style={{ marginTop: "10px", color: "gray", fontSize: "12px" }}
              >
                <Space>
                  <ClockCircleOutlined />
                  {renderDate(post)}
                </Space>
              </div>
              <div style={{ marginTop: "8px", display: "flex", gap: 8 }}>
                <Button
                  type="primary"
                  icon={<DollarCircleOutlined />}
                  onClick={() => {
                    if (!isAuthenticated) {
                      login();
                      return;
                    }
                    getBalance();
                    setSelectedPost(post);
                    setIsTipModalOpen(true);
                  }}
                >
                  Tip
                </Button>
              </div>
            </Card>
          </List.Item>
        )}
      />
      <Modal
        title="📝 Create New Journal"
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        footer={null}
      >
        <CreatePost
          onPostCreated={() => {
            setIsCreateModalOpen(false);
            fetchPosts();
          }}
        />
      </Modal>
      <Modal
        title="💰 Send Tip"
        open={isTipModalOpen}
        onCancel={() => {
          setTipAmount(null);
          setSelectedPost(null);
          setIsTipModalOpen(false);
        }}
        onOk={handleTip}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Text>Amount</Text>
          <Text>Current balance: {balance} ICP</Text>
        </div>
        <Input
          type="number"
          placeholder="Tip Amount"
          value={tipAmount}
          onChange={(e) => setTipAmount(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default PostList;
