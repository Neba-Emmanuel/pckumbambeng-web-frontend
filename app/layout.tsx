import type { Metadata } from "next";
import { AuthProvider } from "@/providers/AuthProvider";
import { NotificationProvider } from "@/providers/NotificationProvider";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import {
  SITE_URL,
  SITE_NAME,
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
} from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "PC Kumba-Mbeng",
    "Presbyterian Church Kumba",
    "Presbyterian Church in Cameroon",
    "Kumba Mbeng church",
    "sermons",
    "worship",
    "Kumba",
    "Cameroon",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Presbyterian Church in Cameroon, Kumba-Mbeng`,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    images: [
      { url: DEFAULT_OG_IMAGE, width: 4032, height: 3024, alt: DEFAULT_OG_IMAGE_ALT },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Presbyterian Church in Cameroon, Kumba-Mbeng`,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  icons: { icon: [{ url: "/pcc-logo.png", sizes: "447x447", type: "image/png" }] },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased overflow-x-hidden">
        <AuthProvider>
          <NotificationProvider>{children}</NotificationProvider>
          <ServiceWorkerRegistration />
        </AuthProvider>
      </body>
    </html>
  );
}
