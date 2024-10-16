import "./globals.css";
import AuthProvider from "../components/auth-provider";
import Navbar from "../components/navbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient()

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="kr" className="max-w-[800px] min-h-[100vh] px-5 mx-auto">
      <AuthProvider>
        <body>
          <Navbar />
          <main>
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          </main>
        </body>
      </AuthProvider>
    </html>
  );
}
