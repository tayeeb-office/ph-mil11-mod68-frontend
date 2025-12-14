import React from 'react';
import { motion } from "framer-motion";
import logo from "../assets/Logo.png";

const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <title>Loading..</title>
      <motion.img
        src={logo}
        alt="loading"
        className="w-[220px] h-[60px] md:w-[360px] md:h-[120px]"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
};

export default Loading;