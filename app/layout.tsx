import { Inter } from "next/font/google";
import "./globals.css";

<link rel="manifest" href="/manifest.json" />
<link rel="icon" href="/icon-192.png" />

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Market Pulse",
  description: "Real-time market insights",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
