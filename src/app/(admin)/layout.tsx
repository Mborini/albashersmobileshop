'use client';

import React from "react";
import '../css/style.css'; // Tailwind or custom CSS
import AdminHeader from "@/components/Admin/layouts/Header";
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider defaultColorScheme="light">

      <AdminHeader />
     
      {children}
    </MantineProvider>
  );
}
