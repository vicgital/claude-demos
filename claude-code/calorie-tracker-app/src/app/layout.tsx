import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Calorie Tracker",
  description: "Track your daily calories and macros",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
