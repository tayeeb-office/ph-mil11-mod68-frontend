import React from "react";
import { useNavigate } from "react-router";

const PaymentCancelled = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fbf6f6] px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow p-8 text-center">
       
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 text-3xl">
          ✕
        </div>

  
        <h1 className="text-2xl font-extrabold text-black">
          Payment Cancelled
        </h1>


        <p className="mt-2 text-sm text-gray-600">
          Your payment was cancelled. No money has been charged.
        </p>


        <button
          onClick={() => navigate("/")}
          className="mt-6 w-full rounded-lg bg-gray-800 px-4 py-3 font-semibold text-white hover:bg-gray-900"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default PaymentCancelled;
