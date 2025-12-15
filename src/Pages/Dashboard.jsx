import React, { useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router";
import { FiGrid, FiList, FiUser, FiLogOut } from "react-icons/fi";
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

  const handelSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <div className="flex">
          {/* Sidebar */}
          <aside className="w-72 bg-white border-r border-slate-200 min-h-screen flex flex-col">
            <div className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-rose-600 font-black">
                  <img src={favicon} alt="favicon" />
                </div>
                <div>
                  <p className="font-extrabold">BloodLink</p>
                  <p className="text-xs text-slate-500 -mt-0.5">Donor Portal</p>
                </div>
              </div>
            </div>

            <nav className="px-4">
              <Link
                to={"/dashboard"}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-rose-600  hover:text-white font-semibold"
              >
                <FiGrid />
                <span>Dashboard</span>
              </Link>

              <div className="mt-2 space-y-1">
                {role == "donor" && (
                  <Link
                    to={"/dashboard/my-donation-requests"}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700  font-medium hover:bg-rose-600  hover:text-white "
                  >
                    <FiList />
                    <span>My Requests</span>
                  </Link>
                )}
                {role == "donor" && (
                  <Link
                    to={"/dashboard/create-donation-request"}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 font-medium hover:bg-rose-600  hover:text-white "
                  >
                    <IoIosCreate />
                    <span>Create Request</span>
                  </Link>
                )}
                {(role === "admin" || role === "volunteer") && (
                  <Link
                    to={"/dashboard/all-blood-donation-request"}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 font-medium hover:bg-rose-600 hover:text-white"
                  >
                    <CiSquareQuestion />
                    <span>Manage Requests</span>
                  </Link>
                )}

                {role == "admin" && (
                  <Link
                    to={"/dashboard/all-users"}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700  font-medium hover:bg-rose-600  hover:text-white "
                  >
                    <MdManageAccounts />
                    <span>Manage Users</span>
                  </Link>
                )}
                <Link
                  to={"/dashboard/profile"}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700  font-medium hover:bg-rose-600  hover:text-white "
                >
                  <FiUser />
                  <span>Profile</span>
                </Link>
              </div>
            </nav>

            <div className="mt-auto p-4">
              <div className="rounded-2xl border border-slate-200 p-4 bg-white">
                <div className="flex items-center gap-3">
                  <img
                    alt="Icon"
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    src={user?.photoURL}
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-sm ">
                      {user?.displayName}
                    </p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
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
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
