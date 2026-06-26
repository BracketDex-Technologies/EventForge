import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_WEB_URL) return process.env.NEXT_PUBLIC_WEB_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
};

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
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
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EventForge — Event Management Platform",
    description: "Plan, ticket, and run professional events. From conferences to concerts, EventForge gives organizers the tools to sell tickets, check in attendees, and engage audiences.",
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
