"use client";
import Link from "next/link";
import logo from "../../public/logo.png";
import logoDark from "../../public/logo-dark.png";
import Image from "next/image";
import { useMounted } from "@/hooks/useMounted";
import { useCurrentTheme } from "@/hooks/useCurrentTheme";

function Logo({ height, width }: { height: number; width: number }) {
  const isDark = useCurrentTheme();
  const mounted = useMounted();

  if (!mounted) return null;

  return (
    <Link href="/" className="flex items-center gap-2">
      <Image
        src={isDark.theme === "dark" ? logo : logoDark}
        alt="logo"
        width={width}
        height={height}
      />
    </Link>
  );
}

export default Logo;
