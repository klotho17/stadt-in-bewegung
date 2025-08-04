import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Bewegtbilder der Stadt in Bewegung 1977-1994",
  description: "Vizualisierter Sammlungszugang zum Bestand 'Stadt in Bewegung'",
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div className="page-wrapper">
          <main>
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
