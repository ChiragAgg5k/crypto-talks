import { AuthProvider } from "@/components/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Crypto Talks",
  description:
    "Your AI-powered crypto companion for real-time insights and market analysis.",
  metadataBase: new URL("https://crypto-talks-eta.vercel.app/"),
  openGraph: {
    title: "Crypto Talks",
    description:
      "Your AI-powered crypto companion for real-time insights and market analysis.",
    url: "https://crypto-talks-eta.vercel.app/",
    siteName: "Crypto Talks",
    images: ["/preview.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster />
        <AuthProvider>
          <CopilotKit runtimeUrl="/api/copilotkit">{children}</CopilotKit>
        </AuthProvider>
      </body>
    </html>
  );
}
