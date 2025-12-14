import React, { Suspense } from "react";
import Navbar from "../Components/Navbar";
import { Outlet } from "react-router";
import Loading from "../Pages/Loading";
import Footer from "../Components/Footer";

const Root = () => {
  const hideLayout = location.pathname === '/*' || location.pathname === '/404';

  return (
    <div>
      {!hideLayout && (
        <header className="md:w-6xl md:mx-auto">
          <Navbar />
        </header>
      )}
      <Suspense fallback={<Loading />}>
        <Outlet></Outlet>
      </Suspense>
      {!hideLayout && (
        <footer>
          <Footer />
        </footer>
      )}
    </div>
  );
};

export default Root;