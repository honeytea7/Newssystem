import React, { useEffect } from "react";

import SideMenu from "../../components/sandbox/SideMenu";
import TopHeader from "../../components/sandbox/TopHeader";

import "./NesSandBox.css";

import 'nprogress/nprogress.css'
import { Layout } from "antd";
import NewsRouter from "../../components/sandbox/NewsRouter";
import { useNavigate } from "react-router-dom";
const { Content } = Layout;


export default function NesSandBox() {
//  NProgress.start();
//   useEffect(() =>{
//      NProgress.done();
//   })
  // const usenavigate = useNavigate();
  // useEffect(() => {
  //   if (!localStorage.getItem('token')) {
  //     usenavigate('/login')
     
  //  }
  // })
  return (
    <Layout>
      <SideMenu></SideMenu>
      <Layout className="site-layout">
        <TopHeader></TopHeader>

        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            padding: 24,
            overflowY:'scroll'
          }}
        >
          <NewsRouter></NewsRouter>
        </Content>
      </Layout>
    </Layout>
  );
}
