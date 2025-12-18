import React from "react";
import Hero1 from "../assets/Hero1.png";
import { Link } from "react-router"; // or react-router-dom depending on your setup

import { FaMapMarkerAlt, FaBell, FaShieldAlt } from "react-icons/fa";
import { FiPhoneCall, FiMapPin } from "react-icons/fi";
import { CiMail } from "react-icons/ci";

const Home = () => {
  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: handle form submit (API call / email / toast)
    console.log("Form submitted");
  };

  return (
    <div>
      {/* First Section */}
      <section className="bg-[#fff8f6]">
        <div className="max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
              Your Droplets of Life <br /> Can Save a Universe
            </h1>

            <p className="mt-5 text-gray-600 max-w-md">
              Connect with donors instantly or become a hero today. Every
              donation counts towards saving a life.
            </p>

            <div className="mt-8 flex gap-4">
              <Link to={"/registration"}>
                <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium">
                  Join as a Donor
                </button>
              </Link>

              <Link to={'/search'}>
              <button className="border border-gray-300 hover:border-red-600 hover:text-red-600 px-6 py-3 rounded-lg font-medium">
                Search Donors
              </button>
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex justify-center">
            <div className="bg-[#fde8e6] p-8 rounded-xl shadow-xl">
              <img src={Hero1} alt="Blood Donation Illustration" className="w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Second Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-2xl mb-12">
            <p className="text-sm font-semibold text-red-600 uppercase">
              Why Choose BloodLink?
            </p>

            <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-gray-900">
              Our Key Features
            </h2>

            <p className="mt-4 text-gray-600">
              We make the process simple, safe, and effective for everyone involved, ensuring help arrives when it's needed most.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#fff8f6] p-6 rounded-xl">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
                <FaMapMarkerAlt />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Find Donors Nearby
              </h3>
              <p className="mt-2 text-gray-600 text-sm">
                Locate blood donors in your vicinity with our real-time map integration, minimizing wait times in emergencies.
              </p>
            </div>

            <div className="bg-[#fff8f6] p-6 rounded-xl">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
                <FaBell />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Emergency Requests
              </h3>
              <p className="mt-2 text-gray-600 text-sm">
                Urgent requests are highlighted and pushed to nearby donors instantly to ensure critical needs are met first.
              </p>
            </div>

            <div className="bg-[#fff8f6] p-6 rounded-xl">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
                <FaShieldAlt />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Safe Process</h3>
              <p className="mt-2 text-gray-600 text-sm">
                We partner with verified medical centers to ensure a sterile, professional, and safe environment for every donation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Third Section */}
      <section className="w-full bg-[#f7f3f3]">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            {/* Left */}
            <div>
              <h2 className="text-3xl font-extrabold text-neutral-900">
                Contact Us
              </h2>
              <p className="mt-3 max-w-md text-sm text-neutral-600">
                Have questions about donating? Need help finding a center? Reach
                out to our team.
              </p>

              <div className="mt-10 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                    <FiPhoneCall className="text-xl text-red-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900">Phone</p>
                    <p className="text-sm text-neutral-600">+1 (555) 123-4567</p>
                    <p className="mt-1 text-xs text-neutral-400">
                      Mon–Fri 9am–6pm
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                    <CiMail className="text-xl text-red-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900">Email</p>
                    <p className="text-sm text-neutral-600">support@bloodlink.org</p>
                    <p className="mt-1 text-xs text-neutral-400">
                      We reply within 24 hours
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                    <FiMapPin className="text-xl text-red-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900">Headquarters</p>
                    <p className="text-sm text-neutral-600">
                      123 Health Avenue, Medical District
                    </p>
                    <p className="text-sm text-neutral-600">New York, NY 10001</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Form */}
            <div className="lg:flex lg:justify-end">
              <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-lg md:p-8">
                <form onSubmit={onSubmit} className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold text-neutral-700">
                        First Name
                      </label>
                      <input
                        type="text"
                        placeholder="Jane"
                        className="mt-2 w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none focus:border-red-400 "
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-neutral-700">
                        Last Name
                      </label>
                      <input
                        type="text"
                        placeholder="Doe"
                        className="mt-2 w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none focus:border-red-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="jane@example.com"
                      className="mt-2 w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none focus:border-red-400 "
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-700">
                      Message
                    </label>
                    <textarea
                      rows={5}
                      placeholder="How can we help you?"
                      className="mt-2 w-full resize-none rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none focus:border-red-400 "
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-lg bg-red-500 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-red-600"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
