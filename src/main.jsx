import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import Root from "../src/Pages/Root.jsx";
import Home from "../src/Pages/Home.jsx";
import Registration from "./Pages/Registration.jsx";
import Login from "./Pages/Login.jsx";
import Provider from "./Provider/Provider.jsx";
import PrivateRoute from "../src/Provider/PrivateRoute.jsx";
import Loading from "./Pages/Loading.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import DashHome from "./Pages/Dashboard Pages/DashHome.jsx";
import MyReq from "./Pages/Dashboard Pages/MyReq.jsx";
import CreateReq from "./Pages/Dashboard Pages/CreateReq.jsx";
import Profile from "./Pages/Dashboard Pages/Profile.jsx";
import User from "./Pages/Dashboard Pages/User.jsx";
import AllReq from "./Pages/Dashboard Pages/AllReq.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, 
        path: "/", 
        Component: Home 
      },
      //   {
      //     path: "/category-filtered-product/:category",
      //     Component: CategoryPage,
      //   },
      //   {
      //     path: "/all/:myId",
      //     element: (
      //       <PrivateRoute>
      //         <Details></Details>
      //       </PrivateRoute>
      //     ),
      //   },
      {
        path: "/registration",
        Component: Registration,
      },
      {
        path: "/login",
        Component: Login,
      },
    ],
  },
  {
    path: "/dashboard",
    element : <PrivateRoute> <Dashboard></Dashboard> </PrivateRoute>,
    children: [
      { index: true, 
        path: "/dashboard", 
        Component: DashHome
      },
      { 
        path: "/dashboard/my-donation-requests", 
        Component : MyReq
      },
      { 
        path: "/dashboard/create-donation-request", 
        Component : CreateReq
      },
      { 
        path: "/dashboard/all-users", 
        Component : User
      },
      { 
        path: "/dashboard/all-blood-donation-request", 
        Component : AllReq
      },
      { 
        path: "/dashboard/profile", 
        Component : Profile
      },
      //   {
      //     path: "/category-filtered-product/:category",
      //     Component: CategoryPage,
      //   },
      //   {
      //     path: "/all/:myId",
      //     element: (
      //       <PrivateRoute>
      //         <Details></Details>
      //       </PrivateRoute>
      //     ),
      //   },
    ],
  },
  {
    path: "/loading",
    Component: Loading
  },
  //   {
  //     path: "*",
  //     Component: Error,
  //   },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
