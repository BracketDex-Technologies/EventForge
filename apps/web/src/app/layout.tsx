import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000'),
  title: {
    default: "EventForge — Event Management Platform",
    template: "%s | EventForge"
  },
  description: "Plan, ticket, and run professional events. From conferences to concerts, EventForge gives organizers the tools to sell tickets, check in attendees, and engage audiences.",
  icons: {
    icon: "/favicon.svg",
    apple: "/logo-icon.svg",
  },
  openGraph: {
    title: "EventForge — Event Management Platform",
    description: "Plan, ticket, and run professional events. From conferences to concerts, EventForge gives organizers the tools to sell tickets, check in attendees, and engage audiences.",
    url: "https://eventforge.app",
    siteName: "EventForge",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "EventForge Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EventForge — Event Management Platform",
    description: "Plan, ticket, and run professional events. From conferences to concerts, EventForge gives organizers the tools to sell tickets, check in attendees, and engage audiences.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
