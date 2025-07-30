"use client";

import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import './css/style.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MantineProvider defaultColorScheme="light">
          <ModalsProvider>
            {children}
          </ModalsProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
