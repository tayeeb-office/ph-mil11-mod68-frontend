import React, { useContext, useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router";
import { FiGrid, FiList, FiUser, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { IoIosCreate } from "react-icons/io";
import { signOut } from "firebase/auth";
import auth from "../Firebase/firebase.config";
import { AuthContext } from "../Provider/Provider";
import favicon from "../assets/favicon.png";
import { CiSquareQuestion } from "react-icons/ci";
import { MdManageAccounts } from "react-icons/md";

const Dashboard = () => {
  const { user, role } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handelSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  const NavItem = ({ to, icon: Icon, label }) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        onClick={() => setSidebarOpen(false)}
        className={[
          "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition",
          active
            ? "bg-rose-600 text-white"
            : "text-slate-700 hover:bg-rose-600 hover:text-white",
        ].join(" ")}
      >
        <Icon />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex">
        {/* Mobile topbar */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-slate-200">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg border border-slate-200"
              aria-label="Open menu"
            >
              <FiMenu />
            </button>

            <div className="flex items-center gap-2">
              <img src={favicon} alt="favicon" className="w-8 h-8" />
              <div>
                <p className="font-extrabold text-sm">BloodLink</p>
              </div>
            </div>

            <div className="w-10" />
          </div>
        </div>

        {/* Overlay (mobile) */}
        {sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden fixed inset-0 z-40 bg-black/40"
            aria-label="Close overlay"
          />
        )}

        {/* Sidebar */}
        <aside
          className={[
            "fixed md:sticky top-0 z-50 md:z-auto",
            "w-72 bg-white border-r border-slate-200 min-h-screen flex flex-col",
            "transition-transform duration-200",
            "md:translate-x-0",
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0",
          ].join(" ")}
        >
          {/* Mobile close button */}
          <div className="md:hidden flex justify-end p-4">
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg border border-slate-200"
              aria-label="Close menu"
            >
              <FiX />
            </button>
          </div>

          <div className="p-6 pt-2 md:pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-rose-600 font-black">
                <img src={favicon} alt="favicon" />
              </div>
              <div>
                <p className="font-extrabold">BloodLink</p>
              </div>
            </div>
          </div>

          <nav className="px-4">
            <NavItem to="/dashboard" icon={FiGrid} label="Dashboard" />

            <div className="mt-2 space-y-1">
              {role === "donor" && (
                <NavItem
                  to="/dashboard/my-donation-requests"
                  icon={FiList}
                  label="My Requests"
                />
              )}

              {role === "donor" && (
                <NavItem
                  to="/dashboard/create-donation-request"
                  icon={IoIosCreate}
                  label="Create Request"
                />
              )}

              {(role === "admin" || role === "volunteer") && (
                <NavItem
                  to="/dashboard/all-blood-donation-request"
                  icon={CiSquareQuestion}
                  label="Manage Requests"
                />
              )}

              {role === "admin" && (
                <NavItem
                  to="/dashboard/all-users"
                  icon={MdManageAccounts}
                  label="Manage Users"
                />
              )}

              <NavItem to="/dashboard/profile" icon={FiUser} label="Profile" />
            </div>
          </nav>

          <div className="mt-auto p-4">
            <div className="rounded-2xl border border-slate-200 p-4 bg-white">
              <div className="flex items-center gap-3">
                <img
                  alt="User"
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  src={user?.photoURL || "https://i.ibb.co/2d0G6nQ/user.png"}
                />
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate">
                    {user?.displayName || "User"}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>

              <button
                onClick={handelSignOut}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold"
              >
                <FiLogOut />
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Main Section */}
        <main className="flex-1 min-w-0 w-full px-4 md:px-6 py-6 md:py-8 mt-14 md:mt-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
