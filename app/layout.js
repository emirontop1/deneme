export const metadata = {
  title: 'Link Gateway Dashboard',
  description: 'LootLabs benzeri çok görevli link geçiş sistemi',
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr" className="dark">
      <head>
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
      </head>
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">{children}</body>
    </html>
  );
}
