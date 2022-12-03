import React, { useLayoutEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "../views/Login/Login";

import NewsSandBox from "../views/sandbox/NesSandBox";

export default function IndexRouter() {
  const { state } = useLocation();
  console.log(state);
  function test() {
    if (state || localStorage.getItem('token')) {
      return true
    }
    else return false
  }
  return (
    <Routes>
      <Route path="/login" element={<Login />}></Route>
      {/* <Route path="/*" element={<NewsSandBox />} /> */}

      <Route
        path="/*"
        element={
          test() ? (
            <NewsSandBox />
          ) : (
            <Navigate to={"login"} />
          )
        }
      ></Route>

      {/* <Route path="/*" element={<NewsSandBox />}></Route> */}
    </Routes>
  );
}
