"use client";

import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { db } from "../../../../../../utils/db";
import { UserAnswer } from "../../../../../../utils/schema";
import { Camera } from "lucide-react";

// Dynamically import Webcam to prevent SSR hydration issues
const Webcam = dynamic(() => import("react-webcam"), { ssr: false });

const RecordAnswerSection = ({ mockInterviewQuestions, activeQuestionIndex, interviewData }) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [results, setResults] = useState([]);
  const { user } = useUser();
  const [userEmail, setUserEmail] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showWebcam, setShowWebcam] = useState(false);
  const [createdAt, setCreatedAt] = useState(""); // Fix for moment() hydration issue
  const webcamRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    setCreatedAt(moment().format("DD-MM-YYYY")); // Ensure moment() runs only on client
  }, []);

  useEffect(() => {
    if (user) {
      setUserEmail(user?.primaryEmailAddress?.emailAddress || "");
    }
  }, [user]);

  console.log("Current User:", user);
  console.log("Active Question:", mockInterviewQuestions[activeQuestionIndex]?.question);

  const toggleWebcam = () => {
    setShowWebcam((prev) => !prev); // Toggle webcam visibility
  };

  const startSpeechRecognition = () => {
    if (!("webkitSpeechRecognition" in window)) {
      toast.error("Speech Recognition API is only available in Google Chrome!");
      return;
    }

    if (!recognitionRef.current) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          finalTranscript += event.results[i][0].transcript;
        }
        setUserAnswer((prevAns) => (prevAns ? prevAns + " " + finalTranscript : finalTranscript));
      };

      recognition.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
        toast.error(`Error: ${event.error}`);
      };

      recognition.onend = () => {
        if (isRecording) {
          recognition.start();
        } else {
          setIsRecording(false);
          recognitionRef.current = null;
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
    }

    setIsRecording(true);
  };

  const stopSpeechRecognition = async () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setIsRecording(false);
    }

    console.log("User Answer:", userAnswer);

    const wordCount = userAnswer.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount < 5) {
      toast.error("Your answer must be at least 5 words long!");
      return;
    }

    const feedbackPrompt = `Question: ${mockInterviewQuestions[activeQuestionIndex]?.question}
    User Answer: ${userAnswer}
    Please give a rating for the answer and suggest areas of improvement (if any) in JSON format with fields: "rating" and "feedback"`;

    try {
      console.log("Fetching AI feedback...");

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: feedbackPrompt }] }],
            generationConfig: { maxOutputTokens: 200, temperature: 0.7 },
          }),
        }
      );

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const result = await response.json();
      let aiResponseText = result.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      aiResponseText = aiResponseText.replace(/```json|```/g, "").trim();

      let mockJsonResp = JSON.parse(aiResponseText);
      console.log("AI Rating:", mockJsonResp.rating);
      console.log("AI Feedback:", mockJsonResp.feedback);
      toast.info(`AI Rating: ${mockJsonResp.rating}/10`);
      toast.info(`Feedback: ${mockJsonResp.feedback}`);

      if (!db) {
        console.error("Database connection is not initialized!");
        toast.error("Database error. Please check your setup.");
        return;
      }

      const userAnswerData = {
        mockId: interviewData?.mockId,
        question: mockInterviewQuestions[activeQuestionIndex]?.question,
        correctAns: mockInterviewQuestions[activeQuestionIndex]?.answer,
        userAns: userAnswer,
        feedback: mockJsonResp.feedback,
        rating: mockJsonResp.rating,
        userEmail: userEmail, // Use state variable
        createdAt: createdAt, // Use state variable
      };

      console.log("Data being inserted into Drizzle DB:", userAnswerData);
      await db.insert(UserAnswer).values(userAnswerData);

      setUserAnswer("");
      setResults([]);
      toast.success("User Answer recorded successfully!");
    } catch (error) {
      console.error("Error fetching AI feedback:", error);
      toast.error("Failed to fetch feedback. Try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-pink-200 to-purple-300 my-10">
      {/* Clickable Webcam Section */}
      <div
        className="bg-white p-6 rounded-lg shadow-2xl flex items-center justify-center border-4 border-purple-400 cursor-pointer"
        onClick={toggleWebcam}
      >
        {showWebcam ? (
          <Webcam mirrored={true} ref={webcamRef} className="w-96 h-72 rounded-lg" />
        ) : (
          <Camera size={80} className="text-purple-500" /> // Big Camera Icon
        )}
      </div>

      <button
        onClick={isRecording ? stopSpeechRecognition : startSpeechRecognition}
        className="mt-6 px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition"
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>

      <h1 className="mt-4 text-lg font-bold text-gray-800">
        {isRecording ? "🎤 Recording in Progress..." : "Click to Start Recording"}
      </h1>
    </div>
  );
};

export default RecordAnswerSection;
