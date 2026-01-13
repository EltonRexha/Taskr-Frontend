"use client"

import { Easing, motion } from "framer-motion"
import { ReactNode } from "react"

type StaggeredCardsProps = {
    id?: string
    children: ReactNode
    stagger?: number
    className?: string
    duration?: number
}

const containerVariants = {
    hidden: {},
    show: (stagger: number) => ({
        transition: {
            staggerChildren: stagger,
        },
    }),
}

const cardVariants = (duration: number) => ({
    hidden: {
        opacity: 0,
        y: 30,
    },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: duration,
            ease: "easeOut" as Easing,
        },
    },
})

export function StaggeredCards({
    id,
    children,
    stagger = 0.15,
    duration = 0.4,
    className
}: StaggeredCardsProps) {
    return (
        <motion.section
            id={id}
            variants={containerVariants}
            custom={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className={className}
        >
            {Array.isArray(children)
                ? children.map((child, i) => (
                    <motion.div key={i} variants={cardVariants(duration)}>
                        {child}
                    </motion.div>
                ))
                : (
                    <motion.div variants={cardVariants(duration)}>
                        {children}
                    </motion.div>
                )}
        </motion.section>
    )
}