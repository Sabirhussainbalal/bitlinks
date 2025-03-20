import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


export const metadata = {
  title: "Bitlinks",
  description: "bitlinks | shorten your links",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className="overflow-hidden"
      >
        {children}
      </body>
    </html>
  );
}
