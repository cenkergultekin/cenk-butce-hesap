import './globals.css'

export const metadata = {
  title: 'Cenker\'in Bütçe Hesaplaması',
  description: 'Modern ve lüks bütçe takip uygulaması - Cenker\'in Bütçe Hesaplaması',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body>{children}</body>
    </html>
  )
} 