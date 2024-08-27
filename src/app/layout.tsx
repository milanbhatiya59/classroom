import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "./_components/authProvider";
import { ContextProvider } from "./(dashboard)/_components/context";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Classroom",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <ContextProvider>
        <html lang='en'>
          <body>
            <main>
              {children}
            </main>
            <Toaster />
          </body>
        </html>
      </ContextProvider>
    </AuthProvider>
  );
}

/*
      
      
*/