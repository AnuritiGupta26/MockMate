"use client";  // ✅ Important for client-side rendering

import { UserButton } from "@clerk/nextjs";
import { usePathname, useRouter } from 'next/navigation'; // ✅ Import useRouter
import { useEffect } from "react";  
import React from "react";

function Header() {
    const path = usePathname();
    const router = useRouter();  // ✅ Router for navigation

    useEffect(() => {
        console.log(path);
    }, [path]);  

    return (
        <div className="flex items-center justify-between px-6 py-4 bg-secondary shadow-md">
            {/* Logo */}
            <img 
                src="/logo.svg" 
                width="160" 
                height="100" 
                alt="logo" 
                className="cursor-pointer" 
                onClick={() => router.push("/")} // ✅ Redirect to Home on Logo Click
            />

            {/* Navigation */}
            <ul className="hidden md:flex gap-6 text-lg font-medium">
                <li 
                    className={`
                        relative cursor-pointer transition-all duration-300 hover:text-[#ff007f] 
                        after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 
                        after:h-1 after:bg-[#ff007f] after:transition-all after:duration-300 hover:after:w-full
                        ${path === '/dashboard' ? 'text-primary font-bold' : ''}
                    `}
                    onClick={() => router.push("/dashboard")} // ✅ Redirect to Dashboard
                >
                    Dashboard
                </li>

                <li 
                    className={`
                        relative cursor-pointer transition-all duration-300 hover:text-[#ff007f] 
                        after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 
                        after:h-1 after:bg-[#ff007f] after:transition-all after:duration-300 hover:after:w-full
                        ${path === '/questions' ? 'text-primary font-bold' : ''}
                    `}
                    onClick={() => router.push("/questions")} // ✅ Redirect to Questions
                >
                    Questions
                </li>

                <li 
                    className={`
                        relative cursor-pointer transition-all duration-300 hover:text-[#ff007f] 
                        after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 
                        after:h-1 after:bg-[#ff007f] after:transition-all after:duration-300 hover:after:w-full
                        ${path === '/upgrade' ? 'text-primary font-bold' : ''}
                    `}
                    onClick={() => router.push("/planData")} // ✅ Redirect to Pricing Page
                >
                    Upgrade
                </li>

                <li 
                    className={`
                        relative cursor-pointer transition-all duration-300 hover:text-[#ff007f] 
                        after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 
                        after:h-1 after:bg-[#ff007f] after:transition-all after:duration-300 hover:after:w-full
                        ${path === '/how-it-works' ? 'text-primary font-bold' : ''}
                    `}
                    onClick={() => router.push("/how-it-works")} // ✅ Redirect to How It Works Page
                >
                    How it works?
                </li>
            </ul>

            {/* User Profile Button */}
            <UserButton />
        </div>
    );
}

export default Header;
