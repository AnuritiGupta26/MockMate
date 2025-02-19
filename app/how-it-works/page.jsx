"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HowItWorks() {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5E1FD] px-6 py-10">
            <h1 className="text-4xl font-extrabold text-[#7B2CBF] mb-6 shadow-md px-6 py-3 bg-[#FFD6EC] rounded-2xl flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-[#FF69B4]" /> How It Works
            </h1>

            <p className="text-lg text-[#7B2CBF] max-w-2xl text-center">
                Learn how our platform helps you prepare for interviews with AI-generated questions, advanced coding challenges, and expert guidance.
            </p>

            <button 
                className="mt-6 px-6 py-2 bg-[#7B2CBF] text-white rounded-lg text-lg font-semibold hover:bg-[#6A1B9A] transition duration-300"
                onClick={() => router.push("/planData")}
            >
                View Plans
            </button>
        </div>
    );
}
