import Navbar from "@/components/Navbar";
import '@/assets/styles/globals.css'

export const metadata = {
  title: "CodeSync",
  description: "Feature-rich Coding Arena",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar/>
        {children}</body>
    </html>
  );
}
