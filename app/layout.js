import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from "@vercel/speed-insights/next"
import Script from 'next/script'
import VersionBadge from '@/components/VersionBadge'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata = {
  title: "Resemy",
  description: "Get past the bots. Get in front of the humans.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <head>
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-M5G2WHPX');`}
        </Script>
      </head>
        <body className="min-h-full flex flex-col">
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-M5G2WHPX"
                  height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}></iframe>
        </noscript>
        {children}
        <VersionBadge />
        <Analytics />

        <SpeedInsights />
                <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-S6XY4Y1J22"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-S6XY4Y1J22');
            gtag('config', 'AW-18456706210');
          `}
        </Script>
      </body>
    </html>
  );
}