"use client"

import { useState, useEffect } from "react"
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarTrigger,
} from "@/components/ui/menubar"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"

import Image from "next/image"
import { Menu, ChevronDown } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import Link from "next/link"

const logoVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.7 } },
}

function Navbar() {
    const [openGetStarted, setOpenGetStarted] = useState(false)
    const [openAbout, setOpenAbout] = useState(false)
    const [isDark, setIsDark] = useState(false)

    useEffect(() => {
        setIsDark(document.documentElement.classList.contains('dark'))
        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains('dark'))
        })
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
        return () => observer.disconnect()
    }, [])

    return (
        <div className="py-2 lg:py-4">
            <div className="h-14 p-4 flex items-center justify-between">
                {/* Logo */}
                <Image src={!isDark ? '/logo.png' : '/logo-dark.png'} alt="logo" width={80} height={30} className="lg:hidden"></Image>

                {/* Desktop Menu */}
                <Menubar className="hidden lg:flex h-16 p-6 lg:w-full">
                    <Link href="/" className="hidden lg:block mr-auto">
                        <motion.div variants={logoVariants} initial="hidden" animate="visible">
                            <Image src={isDark ? '/logo.png' : '/logo-dark.png'} alt="logo" width={80} height={30}></Image>
                        </motion.div>
                    </Link>
                    <MenubarMenu>
                        <MenubarTrigger className="text-xl cursor-pointer" >Get Started</MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem>Sign-up</MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem>Sign-in</MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                    <MenubarMenu>
                        <MenubarTrigger className="text-xl cursor-pointer">About</MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem>Spaces</MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                </Menubar>

                {/* Mobile Drawer Menu */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            className="lg:hidden"
                        >
                            <Menu size={96} className="size-8" color="white" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-64">
                        <SheetTitle className="sr-only">Menu</SheetTitle>
                        <nav className="flex flex-col mt-20 h-full">
                            <div className="flex flex-col">
                                <Collapsible open={openGetStarted} onOpenChange={setOpenGetStarted}>
                                    <CollapsibleTrigger className="text-2xl flex items-center justify-between w-full px-4 py-2 hover:bg-accent rounded-md">
                                        <span>Get Started</span>
                                        <ChevronDown className={`h-4 w-4 transition-transform ${openGetStarted ? 'rotate-180' : ''}`} />
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="ml-4 mt-1 flex flex-col">
                                        <button className="px-4 py-2 hover:bg-accent rounded-md text-left text-xl">
                                            Sign-up
                                        </button>
                                        <button className="px-4 py-2 hover:bg-accent rounded-md text-left text-xl">
                                            Sign-in
                                        </button>
                                    </CollapsibleContent>
                                </Collapsible>

                                <Collapsible open={openAbout} onOpenChange={setOpenAbout}>
                                    <CollapsibleTrigger className="text-2xl flex items-center justify-between w-full px-4 py-2 hover:bg-accent rounded-md">
                                        <span>About</span>
                                        <ChevronDown className={`h-4 w-4 transition-transform ${openAbout ? 'rotate-180' : ''}`} />
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="ml-4 mt-1 flex flex-col">
                                        <button className="px-4 py-2 hover:bg-accent rounded-md text-left text-xl">
                                            Spaces
                                        </button>
                                    </CollapsibleContent>
                                </Collapsible>
                            </div>
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    )
}

export default Navbar