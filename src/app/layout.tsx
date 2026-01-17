import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { AxiosProvider } from "@/components/providers/Axios-provider";
import { ReactQueryProvider } from "@/components/providers/ReactQuery-provider";
import { ThemeProvider } from "@/components/providers/Theme-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Taskr",
  description: "Open source task management app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={`${inter.variable} ${geistSans.variable} ${geistMono.variable}`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ReactQueryProvider>
              <AxiosProvider>{children}</AxiosProvider>
            </ReactQueryProvider>
          </ThemeProvider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
