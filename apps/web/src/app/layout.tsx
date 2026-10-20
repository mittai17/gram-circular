import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ECOZA | Rural Waste & MLP Traceability Platform',
  description: 'End-to-End Multilayer Plastic (MLP) and Rural Waste Value Chain & Traceability System',
  icons: [
    { rel: 'icon', url: '/logo.png' },
    { rel: 'apple-touch-icon', url: '/logo.png' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[#f8faf9] text-gray-900">
        {children}
      </body>
    </html>
  );
}
