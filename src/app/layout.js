import { Suspense } from "react";
import Loading from "./loading"
import { Inter } from "next/font/google";
import { Header } from "@/app/components/header";
import "./globals.css";

export const dynamic = "force-dynamic"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Lab Framework",
  description: "Lab Framework site",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </body>
    </html>
  );
}
