import Navbar from "@/components/Navbar";
import '@/assets/styles/globals.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata = {
  title: "CodeSync",
  description: "Feature-rich Coding Arena",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar/>
        {children}
        <ToastContainer/>
        </body>
    </html>
  );
}
