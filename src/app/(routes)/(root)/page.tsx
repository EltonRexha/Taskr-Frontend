"use client"

import Navbar from "./_components/navbar";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import DotGrid from "@/components/DotGrid";

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function Page() {
  const [isHovering, setIsHovering] = useState(false);

  return <div className="min-h-screen w-full relative overflow-hidden">
    <div className="fixed inset-0 w-full h-screen -z-10">
      <DotGrid
        dotSize={10}
        gap={15}
        baseColor="#7dbb56"
        activeColor="#6CC24A"
        proximity={120}
        shockRadius={250}
        shockStrength={5}
        resistance={750}
        returnDuration={1.5}
      />
    </div>
    <div className="relative z-10 px-2 lg:px-36 xl:px-52">
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
          initial={{y: -10, opacity: 0}}
          animate={{y: 0, opacity: 1}}
          transition={{ type: "spring", stiffness: 300, damping: 20, duration: 0.45 }}
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
  </div>

}