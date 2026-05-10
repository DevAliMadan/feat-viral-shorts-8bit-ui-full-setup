import type { Metadata } from "next";
import "@fontsource/press-start-2p/index.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Viral Shorts 8-bit",
  description: "Turn viral moments into shorts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-mono min-h-screen bg-gray-100">
        {children}
      </body>
    </html>
  );
}
