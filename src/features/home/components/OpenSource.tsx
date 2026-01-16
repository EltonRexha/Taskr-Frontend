'use client';

import { Card, CardContent } from "@/components/ui/card"
import { Github, Heart, Globe, Lock, Server, Users, Code2 } from "lucide-react"
import { motion } from 'framer-motion';
import { StaggeredCards } from "@/components/StaggeredCards";

const benefits = [
    {
        icon: Lock,
        title: "Own Your Data",
        description: "Self-host on your own infrastructure. Your data never leaves your servers.",
    },
    {
        icon: Code2,
        title: "Fully Customizable",
        description: "Fork, modify, and extend. Build the exact features your team needs.",
    },
    {
        icon: Users,
        title: "Community Driven",
        description: "Join 350+ contributors shaping the future of open source project management.",
    },
    {
        icon: Globe,
        title: "No Vendor Lock-in",
        description: "Export your data anytime. Switch hosting providers freely.",
    },
    {
        icon: Server,
        title: "Deploy Anywhere",
        description: "One-click deploy to Vercel, Railway, or any Docker-compatible platform.",
    },
    {
        icon: Heart,
        title: "Free Forever",
        description: "MIT licensed. No premium tiers, no feature gates, no surprises.",
    },
]

export function OpenSource() {
    return (
        <motion.div
            id="open-source"
            initial={{
                opacity: 0,
            }}
            whileInView={{
                opacity: 1,
            }}
            transition={{
                duration: 0.5,
                ease: 'easeOut'
            }}
            viewport={{ once: true }}>
            <section className="py-16 sm:py-20 px-4 border-t border-border">
                <div className="mx-auto max-w-6xl">
                    <StaggeredCards className="text-center mb-12 sm:mb-16">
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary mb-6">
                            <Github className="h-4 w-4" />
                            <span>Open Source</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
                            Built by the community, for the community
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
                            Taskr is 100% open source under the MIT license. Self-host it, customize it, or contribute to make it better
                            for everyone.
                        </p>
                    </StaggeredCards>

                    {/* Benefits grid */}
                    <StaggeredCards className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-16">
                        {benefits.map((benefit) => (
                            <Card key={benefit.title} className="bg-card border-border hover:border-primary/30 transition-colors">
                                <CardContent className="p-4 sm:p-6">
                                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                        <benefit.icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <h3 className="text-base font-semibold text-foreground mb-2">{benefit.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </StaggeredCards>

                </div>
            </section>
        </motion.div >

    )
}
