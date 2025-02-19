"use client";

import React from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { Sparkles, CheckCircle, CreditCard, Home } from "lucide-react";

export default function PlanData() {
    const router = useRouter(); // Initialize router for navigation

    const plans = [
        {
            name: "Basic",
            price: "₹499/month",
            features: ["Access to standard questions", "Basic interview prep", "Community support"],
            bgColor: "bg-[#F8E8FF]", // Light Lavender
            textColor: "text-[#7B2CBF]",
        },
        {
            name: "Pro",
            price: "₹999/month",
            features: ["Everything in Basic", "Advanced coding challenges", "AI-powered feedback", "Exclusive mock tests"],
            bgColor: "bg-[#FFD6EC]", // Soft Pink
            textColor: "text-[#D63384]",
        },
        {
            name: "Premium",
            price: "₹1499/month",
            features: ["Everything in Pro", "1-on-1 mentorship", "Resume & LinkedIn review", "Live interview simulations"],
            bgColor: "bg-[#E1D4FD]", // Premium Lavender
            textColor: "text-[#5A189A]",
        },
    ];

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5E1FD] px-6 py-10">
            <h1 className="text-4xl font-extrabold text-[#7B2CBF] mb-6 shadow-md px-6 py-3 bg-[#FFD6EC] rounded-2xl flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-[#FF69B4]" /> Plan & Pricing
            </h1>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl">
                {plans.map((plan, index) => (
                    <div key={index} className={`rounded-2xl p-6 shadow-lg ${plan.bgColor} border border-[#D8BFD8]`}>
                        <h2 className={`text-2xl font-bold ${plan.textColor}`}>{plan.name}</h2>
                        <p className="text-xl font-semibold mt-2">{plan.price}</p>

                        <ul className="mt-4 space-y-2">
                            {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-center text-lg text-[#7B2CBF]">
                                    <CheckCircle className="w-5 h-5 text-[#FF69B4] mr-2" /> {feature}
                                </li>
                            ))}
                        </ul>

                        <button className="mt-6 w-full bg-[#7B2CBF] text-white py-2 rounded-lg text-lg font-semibold hover:bg-[#6A1B9A] transition duration-300 flex items-center justify-center gap-2">
                            <CreditCard className="w-5 h-5" /> Buy Now
                        </button>
                    </div>
                ))}
            </div>

            {/* Go Home Button */}
            <button
                onClick={() => router.push("/dashboard")}
                className="mt-10 px-6 py-3 bg-[#7B2CBF] text-white rounded-lg text-lg font-semibold hover:bg-[#6A1B9A] transition duration-300 flex items-center gap-2"
            >
                <Home className="w-6 h-6" /> Go Home
            </button>
        </div>
    );
}
