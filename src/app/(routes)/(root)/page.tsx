"use client"

import Navbar from "./_components/navbar";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function Page() {
  const [isHovering, setIsHovering] = useState(false);

  return <div className="px-2 lg:px-36 xl:px-52">
    <Navbar />
    <div className="h-[calc(100vh-10rem)] flex flex-col justify-center items-center">
      <motion.h1
        variants={headerVariants}
        animate="visible"
        initial="hidden"
        className="text-4xl xl:text-9xl lg:text-8xl md:text-7xl sm:text-5xl lg:mx-12 lg:leading-26 xl:leading-36 mx-4 text-accent-darker font-bold tracking-wide text-center capitalize px-4 scale-y-120 select-none ">open source task management</motion.h1>
      <motion.a
        href=""
        className="text-xl lg:text-3xl mt-16 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
        whileHover={{ scale: 1.01 }}
        onHoverStart={() => setIsHovering(true)}
        onHoverEnd={() => setIsHovering(false)}
      >
        Get Started
        <motion.div
          animate={{ x: isHovering ? 6 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
        >
          <ArrowRight size={20} />
        </motion.div>
      </motion.a>
    </div>
  </div>
}
