import React from "react";
import { FiHome } from "react-icons/fi";
import { Link } from "react-router";

const Error = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-4 py-10">
        <div className="w-full rounded-3xl bg-white/70 p-8 shadow-xl ring-1 ring-black/5 backdrop-blur sm:p-12">
          {/* Big 404 */}
          <div className="text-center">
            <div className="mx-auto inline-flex items-center justify-center rounded-2xl bg-red-50 px-5 py-3">
              <span className="text-6xl font-extrabold tracking-tight text-red-500 sm:text-7xl">
                404
              </span>
            </div>

            <h1 className="mt-6 text-2xl font-bold text-slate-900 sm:text-3xl">
              Oops! We can’t find that page.
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              The page you are looking for might have been removed, renamed, or
              is temporarily unavailable. Don’t worry, finding your way back is
              easier than finding a match.
            </p>
          </div>

          {/* <div className="mx-auto mt-8 max-w-xl">
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link to={'/'}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-200"
              >
                <FiHome className="text-base" />
                Return Home
              </Link>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Error;
