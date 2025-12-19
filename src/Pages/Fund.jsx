import React, { useContext, useEffect, useState } from "react";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { AuthContext } from "../Provider/Provider";
import { FaHeart } from "react-icons/fa";

const Fund = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [fundings, setFundings] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const res = await axiosSecure.get("/funding-history");
        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.funding || [];

        setFundings(data);
      } catch (e) {
        console.error(e);
        setFundings([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [axiosSecure]);

  const handleGiveFund = async () => {
    try {
      if (!user?.email) {
        return Swal.fire(
          "Login Required",
          "Please login to donate.",
          "warning"
        );
      }

      const payload = {
        donateAmount: 50, // USD
        donorName: user?.displayName || "Anonymous",
        donorEmail: user?.email,
      };

      const res = await axiosSecure.post("/create-payment-checkout", payload);

      if (!res?.data?.url) {
        return Swal.fire("Error", "Stripe URL not found from server.", "error");
      }

      localStorage.setItem("donateAmount", payload.donateAmount);
      window.location.href = res.data.url;
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Unable to redirect to payment page", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf6f6] px-4 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-black">
              Funding History
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Track your contributions and help save lives.
            </p>
          </div>

          <button
            onClick={handleGiveFund}
            className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-5 py-3 font-semibold text-white shadow hover:bg-red-600"
          >
            <FaHeart /> Give Fund
          </button>
        </div>

        {/* Card */}
        <div className="mt-8 overflow-hidden rounded-2xl border bg-white shadow-sm">
          {/* Table header */}
          <div className="grid grid-cols-12 border-b bg-white px-6 py-4 text-xs font-bold uppercase text-gray-500">
            <div className="col-span-6">Donor Name</div>
            <div className="col-span-3">Fund Amount</div>
            <div className="col-span-3 text-right">Funding Date</div>
          </div>

          {/* Rows */}
          {loading ? (
            <div className="px-6 py-10 text-center text-gray-500">
              Loading...
            </div>
          ) : fundings.length === 0 ? (
            <div className="px-6 py-10 text-center text-gray-500">
              No funding history found.
            </div>
          ) : (
            fundings.map((item) => (
              <div
                key={item._id}
                className="grid grid-cols-12 items-center border-b px-6 py-5"
              >
                <div className="col-span-6 font-semibold text-gray-900">
                  {item.donorName || "Anonymous"}
                </div>

                <div className="col-span-3 font-extrabold text-gray-900">
                  ${Number(item.amount || item.donateAmount || 0).toFixed(2)}
                </div>

                <div className="col-span-3 text-right text-sm text-gray-500">
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString()
                    : item.fundingDate || item.date || ""}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Fund;