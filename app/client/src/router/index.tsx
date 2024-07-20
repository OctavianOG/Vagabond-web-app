import type { RouteObject } from "react-router-dom";
import Layout from "../components/Layout";
import UserRequire from "../components/UserRequire";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import Featured from "../pages/Featured";
import Listings from "../pages/Listings";
import SingleProperty from "../pages/SingleProperty";
import Sell from "../pages/Sell";
import Buy from "../pages/Search";
import Register from "../pages/Register";
import Update from "../pages/Update";

enum Roles {
  ADMIN = "admin",
  USER = "user",
}

const authRoutes: RouteObject = {
  path: "*",
  element: <Layout />,
  children: [
    { path: "login", element: <Login /> },
    { path: "register", element: <Register /> },
  ],
};

const normalRoutes: RouteObject = {
  path: "/",
  element: <Layout />,
  children: [
    { index: true, element: <Home />, caseSensitive: false },
    {
      path: "profile",
      caseSensitive: false,
      element: <UserRequire allowedRoles={Roles.USER || Roles.ADMIN} />,
      children: [{ path: "", element: <Profile /> }],
    },
    {
      path: "sell",
      caseSensitive: false,
      element: <UserRequire allowedRoles={Roles.USER || Roles.ADMIN} />,
      children: [{ path: "", element: <Sell /> }],
    },
    {
      path: "listings",
      caseSensitive: false,
      element: <UserRequire allowedRoles={Roles.USER || Roles.ADMIN} />,
      children: [{ path: "", element: <Listings /> }],
    },
    {
      path: "featured",
      caseSensitive: false,
      element: <UserRequire allowedRoles={Roles.USER || Roles.ADMIN} />,
      children: [{ path: "", element: <Featured /> }],
    },
    {
      path: "properties",
      caseSensitive: false,
      children: [
        { path: ":propertyId", element: <SingleProperty /> },
        { path: "edit/:propertyId", element: <Update /> },
        { path: "search", element: <Buy /> },
      ],
    },
  ],
};

const routes: RouteObject[] = [authRoutes, normalRoutes];

export default routes;
