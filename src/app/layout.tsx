import Provider from "@/components/Provider"
import "./globals.css"
import Navbar from "@/components/Navbar"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="kr" className="max-w-[800px] min-h-[100vh] mx-auto">
      <body>
        <div className="min-h-[100vh] bg-white shadow-sm">
          <Provider>
            <header className="h-[60px] font-semibold text-3xl">
              <Navbar />
            </header>
            <main>{children}</main>
          </Provider>
        </div>
      </body>
    </html>
  )
}