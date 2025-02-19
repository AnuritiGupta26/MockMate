"use client";  // ✅ Forces client-side execution

import { ClerkProvider } from "@clerk/nextjs";
import Header from "./_components/Header"; // ✅ Correct path


export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <div>  {/* ✅ Avoid wrapping inside <html> and <body> */}
        <Header />
        <div className='mx-5 md:mx-20 lg:mx-36'>
        {children}
        </div>
        
      </div>
    </ClerkProvider>
  );
}
