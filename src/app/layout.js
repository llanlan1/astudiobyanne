import "./globals.css";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
});

export const metadata = {
  title: "A STUDIO BY ANNE",
  description: "A private art practice showcasing beauty and art at the forefront. Based in Singapore.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head></head>
      <body
        className={`antialiased ${playfair.className}`}
      >
        {children}
      </body>
    </html>
  );
}
