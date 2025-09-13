import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import { FloatingChatbot } from "@/components/floating-chatbot";

const instrumentSans = Instrument_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SubLease Pro - Student Housing Platform",
  description:
    "Connect with verified students for flexible short-term housing solutions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={instrumentSans.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>{children}</SessionProvider>
          <Toaster richColors position="top-center" />
          <FloatingChatbot />
        </ThemeProvider>
      </body>
    </html>
  );
}
