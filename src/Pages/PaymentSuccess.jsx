import React, { useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { AuthContext } from "../Provider/Provider";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const saveFund = async () => {
      try {
        if (!user?.email) return;
        if (!sessionId) return;

        const key = `fund_saved_${sessionId}`;
        if (localStorage.getItem(key)) return;

        const donateAmount = localStorage.getItem("donateAmount") || 50;

        await axiosSecure.post("/funding-history", {
          donorName: user?.displayName || "Anonymous",
          donateAmount: Number(donateAmount),
        });

        localStorage.setItem(key, "true");
      } catch (err) {
        console.error(err);
      }
    };

    saveFund();
  }, [axiosSecure, user?.email, user?.displayName, sessionId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fbf6f6] px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700 text-3xl">
          ✓
        </div>

        <h1 className="text-2xl font-extrabold text-black">Payment Successful</h1>
        <p className="mt-2 text-sm text-gray-600">
          Thank you for your donation. Your payment has been completed successfully.
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-6 w-full rounded-lg bg-red-500 px-4 py-3 font-semibold text-white hover:bg-red-600"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
