import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Home from "../../views/sandbox/Home/Home";
import UserList from "../../views/sandbox/user-manage/UserList";
import RoleList from "../../views/sandbox/right-manage/RoleList";
import RightList from "../../views/sandbox/right-manage/RightList";
import NoPermission from "../../views/sandbox/nopermission/NoPermission";
import NewsAdd from "../../views/sandbox/news-manage/NewsAdd";
import NewsDraft from "../../views/sandbox/news-manage/NewsDraft";
import NewsCategory from "../../views/sandbox/news-manage/NewsCategory";
import Audit from "../../views/sandbox/audit-manage/Audit";
import AuditList from "../../views/sandbox/audit-manage/AuditList";
import UnPublish from "../../views/sandbox/publish-manage/UnPublish";
import Publish from "../../views/sandbox/publish-manage/Publish";
import SunSet from "../../views/sandbox/publish-manage/SunSet";
import NewsPreview from "../../views/sandbox/news-manage/NewsPreview";
import axios from "axios";
import NewsUpdate from "../../views/sandbox/news-manage/NewsUpdate";
import { Spin } from "antd";
const LocalRouterMap = {
  "/home": <Home />,
  "/user-manage/list": <UserList />,
  "/right-manage/role/list": <RoleList />,
  "/right-manage/right/list": <RightList />,
  "/news-manage/add": <NewsAdd />,
  "/news-manage/draft": <NewsDraft />,
  "/news-manage/category": <NewsCategory />,
  "/news-manage/preview/:id": <NewsPreview />,
  "/news-manage/update/:id": <NewsUpdate />,
  "/audit-manage/audit": <Audit />,
  "/audit-manage/list": <AuditList />,
  "/publish-manage/unpublished": <UnPublish />,
  "/publish-manage/published": <Publish />,
  "/publish-manage/sunset": <SunSet />,
};
export default function NewsRouter() {
  const [BackRouteList, setBackRouteList] = useState([]);
  const isloading = useSelector(state=>state.loading.loading)

  useEffect(() => {
    Promise.all([
      axios.get("/rights"),
      axios.get("/children"),
    ]).then((res) => {
      setBackRouteList([...res[0].data, ...res[1].data]);
    });
  }, []);
  const {role:{rights}}=JSON.parse(localStorage.getItem('token'))
  const checkRoute = (item) => {
    return LocalRouterMap[item.key] && (item.pagepermisson||item.routepermisson);
  };
  const checkUserPermission = (item) => {
  return rights?.includes(item.key)
}
  return (
    <Spin size="large" spinning={isloading}>
      <Routes>
        {BackRouteList.map((item) => {
          if (checkRoute(item) && checkUserPermission(item)) {
            return (
              <Route
                path={item.key}
                key={item.key}
                element={LocalRouterMap[item.key]}
              ></Route>
            );
          } else return null;
        })}

        {BackRouteList.length > 0 && (
          <Route path="*" element={<NoPermission />}></Route>
        )}
        <Route path="/" element={<Navigate to={"/home"} />}></Route>
      </Routes>
    </Spin>
  );
}
