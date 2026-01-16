"use client";
import Link from "next/link";
import logo from "../../public/logo.png";
import logoDark from "../../public/logo-dark.png";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useMounted } from "@/hooks/useMounted";

function Logo({ height, width }: { height: number; width: number }) {
  const { systemTheme, theme } = useTheme();
  const mounted = useMounted();
  const isDark = theme === "system" ? systemTheme === "dark" : theme === "dark";

  if (!mounted) return null;

  return (
    <Link href="/" className="flex items-center gap-2">
      {/* If its dark theme use the light logo, else use the dark logo */}
      <Image
        src={isDark ? logo : logoDark}
        alt="logo"
        width={width}
        height={height}
      />
    </Link>
  );
}

export default Logo;
