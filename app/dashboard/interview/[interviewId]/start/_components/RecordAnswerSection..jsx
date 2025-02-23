"use client";

import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { db } from "../../../../../../utils/db";
import { UserAnswer } from "../../../../../../utils/schema";
import { Camera } from "lucide-react";

const Webcam = dynamic(() => import("react-webcam"), { ssr: false });

const RecordAnswerSection = ({ mockInterviewQuestions, activeQuestionIndex, interviewData }) => {
  const [userAnswer, setUserAnswer] = useState(""); // Stores full answer
  const { user } = useUser();
  const [userEmail, setUserEmail] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showWebcam, setShowWebcam] = useState(false);
  const webcamRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (user) {
      setUserEmail(user?.primaryEmailAddress?.emailAddress || "");
    }
  }, [user]);

  const startSpeechRecognition = () => {
    if (!("webkitSpeechRecognition" in window)) {
      toast.error("Speech Recognition API is only available in Google Chrome!");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true; // Keep listening continuously
    recognition.interimResults = true; // Get real-time updates
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let finalTranscript = userAnswer;
      for (let i = event.resultIndex; i < event.results.length; i++) {
        finalTranscript += event.results[i][0].transcript + " ";
      }
      setUserAnswer(finalTranscript.trim());
    };

    recognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
      toast.error(`Error: ${event.error}`);
    };

    recognition.onend = () => {
      if (isRecording) {
        recognition.start(); // Restart recognition if user hasn't stopped it
      }
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
  };

  const fetchAiFeedback = async (answer) => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `Evaluate the following interview answer:\n\nQuestion: ${mockInterviewQuestions[activeQuestionIndex]?.question}\nAnswer: ${answer}\n\nProvide constructive feedback first, then separately state "Rating: X/10".`,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      const aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No feedback available";

      console.log("📝 AI Full Response:", aiResponse);

      // Extract rating separately
      const ratingMatch = aiResponse.match(/Rating:\s*(\d+)\/10/);
      const rating = ratingMatch ? parseInt(ratingMatch[1], 10) : null;

      // Remove rating part from feedback
      const feedback = aiResponse.replace(/Rating:\s*\d+\/10/, "").trim();

      console.log("📝 AI Feedback (Cleaned):", feedback);
      console.log("⭐ AI Rating:", rating);

      return { feedback, rating };
    } catch (error) {
      console.error("❌ Error fetching AI feedback:", error);
      return { feedback: "AI feedback unavailable", rating: null };
    }
  };

  const stopSpeechRecognition = async () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setIsRecording(false);
    }

    const finalUserAnswer = userAnswer.trim() || "No answer for this question";

    // Fetch AI-generated feedback & rating
    const { feedback, rating } = await fetchAiFeedback(finalUserAnswer);

    console.log("✅ Final Answer:", finalUserAnswer);
    console.log("📝 AI Feedback:", feedback);
    console.log("⭐ AI Rating:", rating);

    const userAnswerData = {
      mockId: interviewData?.mockId,
      question: mockInterviewQuestions[activeQuestionIndex]?.question || "Untitled Question",
      correctAns: mockInterviewQuestions[activeQuestionIndex]?.answer || "No correct answer provided",
      userAns: finalUserAnswer,
      feedback: feedback, // ✅ Feedback stored separately
      rating: rating ? rating.toString() : "N/A", // ✅ Rating stored separately
      userEmail: userEmail,
      createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
    };

    try {
      await db.insert(UserAnswer).values(userAnswerData);
      toast.success("User Answer recorded successfully!");
      console.log("📌 Saved to DB:", userAnswerData);
    } catch (error) {
      console.error("❌ Database Error:", error);
      toast.error("Failed to save answer. Try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-pink-200 to-purple-300 my-10">
      <div
        className="bg-white p-6 rounded-lg shadow-2xl flex items-center justify-center border-4 border-purple-400 cursor-pointer"
        onClick={() => setShowWebcam(!showWebcam)}
      >
        {showWebcam ? (
          <Webcam mirrored ref={webcamRef} className="w-96 h-72 rounded-lg" />
        ) : (
          <Camera size={80} className="text-purple-500" />
        )}
      </div>

      <button
        onClick={isRecording ? stopSpeechRecognition : startSpeechRecognition}
        className="mt-6 px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition"
      >
        {isRecording ? "Stop Recording & Save" : "Record Answer"}
      </button>

      <h1 className="mt-4 text-lg font-bold text-gray-800">
        {isRecording ? "🎤 Recording in Progress..." : "Click to Start Recording"}
      </h1>

      {userAnswer && (
        <div className="mt-4 bg-white p-4 rounded-lg shadow-md w-3/4">
          <h2 className="text-purple-600 font-semibold">Your Answer:</h2>
          <p className="text-gray-800">{userAnswer}</p>
        </div>
      )}
    </div>
  );
};

export default RecordAnswerSection;
