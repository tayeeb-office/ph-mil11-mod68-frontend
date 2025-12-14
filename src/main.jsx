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

const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, 
        path: "/", 
        Component : Home
    },
    //   {
    //     path: "/pets&supplies",
    //     Component: PetsAndSupplies,
    //   },
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
    //   {
    //     path: "/addlisting",
    //     Component: AddListing,
    //   },
    //   {
    //     path: "/mylistings",
    //     Component: MyListings,
    //   },
    //   {
    //     path: "/myorders",
    //     Component: MyOrders,
    //   },
      {
        path: "/registration",
        Component: Registration,
      },
      {
        path: "/login",
        Component: Login,
      },
      {
        path: "/loading",
        Component: Loading,
      },
    ],
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