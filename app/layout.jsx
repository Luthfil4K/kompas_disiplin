
"use client"

import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from "@/lib/auth-context";
import { createContext, useContext, useEffect, useState } from "react";
import { getMe } from "./services/auth";
import './globals.css'

const geistSans = Geist({ 
  subsets: ['latin'],
  variable: '--font-geist-sans'
})

const geistMono = Geist_Mono({ 
  subsets: ['latin'],
  variable: '--font-geist-mono'
})


export default function RootLayout({ children }) {

  const [user, setUser] = useState(null);

  useEffect(() => {
    getMe()
      .then((res) => setUser(res.user))
      .catch(() => setUser(null));
  }, []);

  return (
    <html lang="en">
      <body className="...">
        <AuthProvider value={{ user }}>
          {children}
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
