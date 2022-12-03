import React, { useEffect } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import "./Login.css";
import Particles from "react-tsparticles";
import axios from "axios";
import { useNavigate } from "react-router-dom/dist";
import { useState } from "react";
export default function Login() {
   
  const usenavigate = useNavigate();
  const onFinish = (values) => {
    console.log(values);
    axios
      .get(
        `/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`
      )
      .then((res) => {
       
        
          if (res.data.length === 0) {
            message.error("用户名或密码错误");
          } else {
            message.success("登录成功");
            localStorage.setItem("token", JSON.stringify(res.data[0]));
            console.log(localStorage.getItem("token"));
         
            usenavigate("/",{state:res.data[0]});
           
            
          }
       
       
      })
   
  };
  
  return (
    <div
      style={{
        background: "rgb(35,39,65)",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Particles />
      <div className="formContainer">
        <div className="login-title">系统的登录界面</div>
        <Form
          name="normal_login"
          className="login-form"
        
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your Username!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input
              
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
               autoComplete='true'
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
