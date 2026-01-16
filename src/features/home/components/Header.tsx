"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import Image from "next/image"
import logo from '../../../../public/logo.png'

const links: { name: string, id: string }[] = [
    {
        name: 'Home',
        id: "Home"
    },
    {
        name: 'Features',
        id: "features"
    },
    {
        name: 'Open Source',
        id: "open-source"
    },
    {
        name: 'Deploy',
        id: "deploy"
    }
]

export function LandingHeader() {
    const [open, setOpen] = useState(false)

    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2">
                    <Image src={logo} alt="logo" width={100} height={45}/>
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    {
                        links.map(({ name, id }) => {
                            return <Link href={`#${id}`} key={id} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                {name}
                            </Link>
                        })
                    }
                </nav>

                <div className="hidden md:flex items-center gap-4">
                    <Link href="/login">
                        <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                            Sign in
                        </Button>
                    </Link>
                    <Link href="/register">
                        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Get Started</Button>
                    </Link>
                </div>

                {/* Mobile menu */}
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-full sm:w-80 bg-background border-border p-0">
                        <div className="flex flex-col h-full">
                            <div className="flex items-center justify-between p-4 border-b border-border">
                                <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                                        <span className="text-sm font-bold text-primary-foreground">T</span>
                                    </div>
                                    <span className="text-lg font-semibold text-foreground">Taskr</span>
                                </Link>
                                <SheetClose asChild>
                                    <Button variant="ghost" size="icon">
                                        <X className="h-5 w-5" />
                                    </Button>
                                </SheetClose>
                            </div>
                            <nav className="flex-1 p-4 space-y-1">
                                {
                                    links.map(({ name, id }) => {
                                        return <Link
                                            href={`#${id}`}
                                            onClick={() => setOpen(false)}
                                            key={id}
                                            className="flex items-center px-4 py-3 rounded-lg text-foreground hover:bg-secondary transition-colors"
                                        >
                                            {name}
                                        </Link>
                                    })
                                }
                            </nav>
                            <div className="p-4 space-y-3 border-t border-border">
                                <Link href="/dashboard" onClick={() => setOpen(false)}>
                                    <Button variant="outline" className="w-full bg-transparent">
                                        Sign in
                                    </Button>
                                </Link>
                                <Link href="/dashboard" onClick={() => setOpen(false)}>
                                    <Button className="w-full bg-primary text-primary-foreground">Get Started</Button>
                                </Link>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    )
}
