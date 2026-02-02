import React from "react"
import type { Metadata } from 'next'
import { Great_Vibes, Poppins } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CartProvider } from '@/lib/cart-context'
import { UiSoundProvider } from '@/components/ui-sound-provider'
import { MusicPlayer } from '@/components/music-player'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const greatVibes = Great_Vibes({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-greatvibes',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Bagsberry - Luxury Bags & Accessories',
  description: 'Discover Bagsberry\'s premium collection of handcrafted luxury bags and accessories. Elevate your style with our curated selection of designer purses and handbags.',
  generator: 'v0.app',
  keywords: 'luxury bags, designer purses, handbags, accessories, premium bags',
  openGraph: {
    title: 'Bagsberry - Luxury Bags & Accessories',
    description: 'Discover our premium collection of handcrafted luxury bags and accessories.',
    type: 'website',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${greatVibes.variable} font-sans antialiased`}>
        <CartProvider>
          <UiSoundProvider>
            {children}
            <MusicPlayer />
            <Toaster />
            <Analytics />
          </UiSoundProvider>
        </CartProvider>
      </body>
    </html>
  )
}
