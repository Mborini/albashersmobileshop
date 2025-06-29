"use client";

import { MantineProvider } from '@mantine/core';
import './css/style.css'; // Tailwind or custom CSS
import '@mantine/core/styles.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MantineProvider defaultColorScheme="light">
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
