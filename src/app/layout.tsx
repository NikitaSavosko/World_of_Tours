import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "react-hot-toast"

const mulishFont = Mulish({
  weight: ['200', '300', '400', '500', '700', '800', '900', '1000'],
  style: ['normal', 'italic'],
  subsets: ["cyrillic"],
  display: 'swap',
  variable: "--font-mulish",
});

export const metadata: Metadata = {
  title: "World of Tours",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${mulishFont.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
