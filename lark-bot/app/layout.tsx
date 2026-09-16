import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import RootFooter from "@/components/RootFooter";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "飞书智能机器人管理平台",
  description: "管理你的飞书智能机器人",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("min-h-screen h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <body className={"min-h-screen w-full flex flex-col items-center p-8 gap-6"}>
        <main className={"h-screen w-full shrink-0 flex flex-col items-center p-8 gap-6"}>
          {children}
        </main>
        <RootFooter />
      </body>
    </html>
  );
}
