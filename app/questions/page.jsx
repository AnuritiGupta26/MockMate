"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Home } from "lucide-react"; 

export default function Questions() {
    const router = useRouter();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY; 

    useEffect(() => {
        const fetchQuestions = async () => {
            if (!geminiApiKey) {
                setError("API key is missing. Set it in .env.local.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(
                    `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${geminiApiKey}`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            contents: [{ parts: [{ text: "Generate 20 well-formatted technical interview questions for a software developer. Include section headings like 'Core Programming Concepts' and 'Algorithms and Complexity'." }] }]
                        })
                    }
                );

                if (!response.ok) throw new Error(`API request failed with status ${response.status}`);

                const data = await response.json();
                console.log("API Response:", data);

                let generatedContent = data.candidates?.[0]?.content?.parts?.[0]?.text || "No questions found";
                let formattedLines = generatedContent.split("\n").filter(line => line.trim() !== "");

                let structuredQuestions = formattedLines.map((line, index) => {
                    if (/^\*\*(.*?)\*\*$/.test(line)) {
                        return { type: "heading", text: line.replace(/\*\*/g, "").trim() };
                    } else {
                        return { type: "question", text: line.replace(/^\d+\.\s*/, "").trim() };
                    }
                });

                setQuestions(structuredQuestions);
            } catch (err) {
                setError(`Error: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5E1FD] px-6 py-10">
            {/* Main Heading */}
            <h1 className="text-4xl font-extrabold text-[#7B2CBF] mb-6 shadow-md px-6 py-3 bg-[#FFD6EC] rounded-2xl flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-[#FF69B4]" /> Interview Questions
            </h1>

            {loading && <p className="text-[#7B2CBF] animate-pulse">Loading questions...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {/* Properly Styled Question Box */}
            <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl border border-[#D8BFD8] p-6 space-y-4">
                {questions.map((item, index) => (
                    item.type === "heading" ? (
                        <h2 key={index} className="text-2xl font-bold text-[#6A1B9A] mt-4">{item.text}</h2>
                    ) : (
                        <div 
                            key={index} 
                            className="text-lg font-medium text-[#7B2CBF] px-4 py-2 rounded-lg bg-[#F8E8FF] hover:bg-[#EBD1FF] transition duration-300"
                        >
                            {index + 1}. {item.text}
                        </div>
                    )
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
