import type { Metadata } from "next";
import { AuthProvider } from "@/providers/AuthProvider";
import { NotificationProvider } from "@/providers/NotificationProvider";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import "./globals.css";

export const metadata: Metadata = {
  title: "PC Kumba-Mbeng",
  description: "Presbyterian Church Kumba-Mbeng Web Application",
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
