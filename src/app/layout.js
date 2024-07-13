import { Inter } from "next/font/google";
import { Header } from "@/app/components/header";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Lab Framework Demo",
  description: "Example of a Lab Framework site",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
      </body>
    </html>
  );
}
