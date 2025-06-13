import "./globals.css";

export const metadata = {
  title: "A STUDIO BY ANNE",
  description: "A private art practice showcasing beauty and art at the forefront. Based in Singapore.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="antialiased"
        style={{
          fontFamily: 'Arial, Helvetica, sans-serif',
        }}
      >
        {children}
      </body>
    </html>
  );
}
