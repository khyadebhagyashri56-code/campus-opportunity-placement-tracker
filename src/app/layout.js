import "./globals.css";

export const metadata = {
  title: "Campus Opportunity & Placement Tracker",
  description: "Track internships and placement opportunities",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}