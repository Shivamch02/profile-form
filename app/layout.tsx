import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Profile Updaetd",
  description: "Update your profile information",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
