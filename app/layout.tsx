import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "UniAbuja Smart Weather Monitoring System",
  description:
    "Real-time weather monitoring and environmental alerts for the University of Abuja campus.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen text-slate-800">
        <Nav />
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        <footer className="text-center text-xs text-slate-400 py-8">
          Prototype system — Department of Computer Science, University of Abuja
        </footer>
      </body>
    </html>
  );
}
