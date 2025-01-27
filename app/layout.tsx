import './globals.css'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import { Geist, Geist_Mono } from "next/font/google"
import { ParkProvider } from '@/contexts/ParkContext'
import { AccountPitchProvider } from '@/contexts/AccountPitchContext'
import { UserProvider } from '@/contexts/UserContext'
import { AirportProvider } from '@/contexts/AirportContext'
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
            <AirportProvider>
              <UserProvider>
                <Navbar />
                <div className="pt-16">
                  {children}
                </div>
              </UserProvider>
            </AirportProvider>
          </ParkProvider>
        </AccountPitchProvider>
      </body>
    </html>
  )
}
