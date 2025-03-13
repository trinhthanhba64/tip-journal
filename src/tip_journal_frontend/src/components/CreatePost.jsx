import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useAuth } from "../hooks/use-auth-client";

const CreatePost = (props) => {
  const { actor } = useAuth();

  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);
    const res = await actor.createPost(values.title, values.content);
    setLoading(false);
    if (res.err) {
      console.log(res.err);
      message.error("Error!");
      return;
    }
    message.success("Success!");
    form.resetFields();
    props.onPostCreated();
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item label="Title" name="title" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Content" name="content" rules={[{ required: true }]}>
        <Input.TextArea rows={6} />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={loading}>
        Create
      </Button>
    </Form>
  );
};

export default CreatePost;
