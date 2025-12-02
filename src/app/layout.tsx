import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SMMCompare - The Ultimate SMM Panel Database',
  description: 'Search and compare 2,500+ SMM panels and 3 million+ services. Find the best prices for Instagram, YouTube, TikTok, and more.',
  keywords: ['SMM panel', 'social media marketing', 'Instagram followers', 'YouTube subscribers', 'TikTok views', 'SMM compare'],
  authors: [{ name: 'SMMCompare' }],
  openGraph: {
    title: 'SMMCompare - The Ultimate SMM Panel Database',
    description: 'Search and compare 2,500+ SMM panels and 3 million+ services.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SMMCompare - The Ultimate SMM Panel Database',
    description: 'Search and compare 2,500+ SMM panels and 3 million+ services.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
