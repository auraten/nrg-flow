import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NRG Flow — New River Gorge Conditions",
  description:
    "Real-time water conditions for the New River Gorge. Rafting, kayaking, river surfing, rock climbing access, and Gauley River releases.",
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-stone-950 text-stone-100">{children}</body>
    </html>
  );
}
