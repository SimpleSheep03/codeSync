import Navbar from "@/components/Navbar";
import '@/assets/styles/globals.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthProvider from "@/components/AuthProvider";

export const metadata = {
  title: "CodeSync",
  description: "Feature-rich Coding Arena",
};

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
    <html lang="en">
      <body>
        <Navbar/>
        {children}
        <ToastContainer/>
        </body>
    </html>
    </AuthProvider>
  );
}
