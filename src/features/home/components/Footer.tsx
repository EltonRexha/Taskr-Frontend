import Link from "next/link"
import { Github } from "lucide-react"
import logo from '../../../../public/logo.png'
import Image from "next/image"

const footerLinks = {
    Product: [
        { label: "Features", href: "#features" },
        { label: "Live Demo", href: "/dashboard" },
        { label: "Roadmap", href: "https://github.com/taskr/taskr/projects" },
        { label: "Changelog", href: "https://github.com/taskr/taskr/releases" },
    ],
    Developers: [
        { label: "Documentation", href: "https://docs.taskr.dev" },
        { label: "API Reference", href: "https://docs.taskr.dev/api" },
        { label: "Self-Hosting Guide", href: "https://docs.taskr.dev/self-hosting" },
        { label: "Contributing", href: "https://github.com/taskr/taskr/blob/main/CONTRIBUTING.md" },
    ],
    Community: [
        { label: "GitHub Discussions", href: "https://github.com/taskr/taskr/discussions" },
        { label: "Blog", href: "https://blog.taskr.dev" },
    ],
    Resources: [
        { label: "Report a Bug", href: "https://github.com/taskr/taskr/issues/new" },
        { label: "Request Feature", href: "https://github.com/taskr/taskr/issues/new?template=feature_request.md" },
        { label: "Security Policy", href: "https://github.com/taskr/taskr/security/policy" },
        { label: "License (MIT)", href: "https://github.com/taskr/taskr/blob/main/LICENSE" },
    ],
}

export function Footer() {
    return (
        <footer className="border-t border-border py-12 sm:py-16 px-4">
            <div className="mx-auto max-w-7xl">
                {/* Links grid */}
                <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 mb-12">
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <h3 className="text-sm font-semibold text-foreground mb-4">{category}</h3>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                            target={link.href.startsWith("http") ? "_blank" : undefined}
                                            rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom */}
                <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-border gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-2">
                            <Image src={logo} alt="logo" width={100} height={45} />
                        </Link>
                        <div className="flex items-center gap-3 ml-4">
                            <a
                                href="https://github.com/taskr/taskr"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Github className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    <p className="text-sm text-muted-foreground text-center sm:text-right">
                        Open source under MIT License. Made with care by the community.
                    </p>
                </div>
            </div>
        </footer>
    )
}
