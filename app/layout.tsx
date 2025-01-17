import './globals.css'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import { Geist, Geist_Mono } from "next/font/google"
import { ParkProvider } from '@/lib/context/ParkContext'
import { AccountPitchProvider } from '@/contexts/AccountPitchContext'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'parkscout.io | National Parks Explorer',
  description: 'Explore US National Parks with an interactive map',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AccountPitchProvider>
          <ParkProvider>
            <Navbar />
            <div className="pt-16">
              {children}
            </div>
          </ParkProvider>
        </AccountPitchProvider>
      </body>
    </html>
  )
}
