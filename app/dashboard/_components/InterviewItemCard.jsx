"use client"; // Ensures this component runs only on the client

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

function InterviewItemCard({ interview }) {
  const router = useRouter();
  const [formattedDate, setFormattedDate] = useState("Loading...");
  const [isClient, setIsClient] = useState(false);

  // Ensuring the component only runs on the client
  useEffect(() => {
    setIsClient(true);
    if (interview?.createdAt) {
      setFormattedDate(new Date(interview.createdAt).toISOString().split("T")[0]);
    } else {
      setFormattedDate("N/A");
    }
  }, [interview]);

  // Prevent rendering until client hydration is complete
  if (!isClient) return null;

  const onStart = () => router.push(`/dashboard/interview/${interview?.mockId}`);
  const onFeedbackPress = () => router.push(`/dashboard/interview/${interview?.mockId}/feedback`);

  return (
    <div className="border border-purple-300 shadow-sm rounded-2xl p-5 bg-purple-50 hover:shadow-md transition-shadow duration-300 ease-in-out">
      <h2 className="font-semibold text-lg text-purple-800">{interview?.jobPosition}</h2>
      <h2 className="text-md text-purple-600">{interview?.jobExperience} Years of Experience</h2>
      <h2 className="text-sm text-gray-600 mt-1">
        Created At: <span className="text-gray-700">{formattedDate}</span>
      </h2>
      <div className="flex justify-between mt-4 gap-4">
        <Button 
          size="sm" 
          variant="outline" 
          className="w-full border-purple-400 text-purple-700 hover:bg-purple-100 transition-all duration-300"
          onClick={onFeedbackPress}
        >
          Feedback
        </Button>
        <Button 
          size="sm" 
          className="w-full bg-pink-400 text-white hover:bg-pink-500 transition-all duration-300"
          onClick={onStart}
        >
          Start
        </Button>
      </div>
    </div>
  );
}

export default InterviewItemCard;
