export const metadata = {
  title: 'LinkSurvey - Dashboard',
  description: 'Linklerinizi anket duvarıyla paraya veya etkileşime dönüştürün',
}

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <head>
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
      </head>
      <body className="bg-slate-900 text-slate-100 font-sans antialiased">
        {children}
      </body>
    </html>
  )
}

