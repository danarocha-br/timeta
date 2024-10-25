import type { Metadata } from "next";
import localFont from "next/font/local";
import { Figtree } from "next/font/google";

import "./globals.css";
import { siteConfig } from "@/config/site";
import { ThemeProvider } from "./theme-provider";
import { Providers } from "./providers";

const sans = Figtree({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-sans",
});
const secondary = localFont({
  display: "swap",
  src: "./fonts/ClashDisplay-Variable.woff2",
  variable: "--font-secondary",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "tabata",
    "timer",
    "hiit",
    "interval-timer",
    "workout-timer",
    "fitness-app",
    "exercise-timer",
    "training-app",
    "interval-training",
    "fitness-tracker",
    "workout-app",
  ],
  authors: [
    {
      name: "Dana Rocha",
      url: "https://danarocha.com",
    },
  ],
  creator: "danarocha",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      "https://res.cloudinary.com/danarocha/image/upload/v1729873097/timeta-og.png",
    ],
    creator: "@danarocha",
  },
  icons: {
    icon: "./favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <head>
        <title>Hello world</title>
        <meta
          property="og:image"
          content="https://res.cloudinary.com/danarocha/image/upload/v1729873097/timeta-og.png"
        />
      </head>

      <html lang="en">
        <Providers>
          <body
            className={`${secondary.variable} ${sans.variable} antialiased`}
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="toned"
              themes={["light", "dark", "toned"]}
              // enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </body>
        </Providers>
      </html>
    </>
  );
}
