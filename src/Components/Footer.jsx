import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { MdBloodtype } from "react-icons/md";

const Footer = () => {
  return (
    <div>
      <footer className=" bg-white font-bold">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Logo & Copyright */}
          <div className="flex flex-col gap-2 text-gray-600">
            <div className="flex items-center gap-1">
              <MdBloodtype className="text-red-600 text-xl" />
              <span className="font-extrabold text-gray-800">BloodLink</span>
            </div>
            <span className="text-sm">
              © 2023 BloodLink. Saving lives together.
            </span>
          </div>

          {/* Center: Links */}
          <div className="flex gap-6 text-sm text-gray-600">
            <a href="#" className="hover:text-red-600">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-red-600">
              Terms of Service
            </a>
            <a href="#" className="hover:text-red-600">
              About Us
            </a>
            <a href="#" className="hover:text-red-600">
              Careers
            </a>
          </div>

          {/* Right: Social Icons */}
          <div className="flex gap-3">
            <a
              href="#"
              className="p-2 rounded-md bg-gray-100 hover:bg-red-600 hover:text-white transition"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              className="p-2 rounded-md bg-gray-100 hover:bg-red-600 hover:text-white transition"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              className="p-2 rounded-md bg-gray-100 hover:bg-red-600 hover:text-white transition"
            >
              <FaInstagram />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
