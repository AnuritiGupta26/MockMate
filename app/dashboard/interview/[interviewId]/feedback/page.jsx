"use client";

import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { desc, limit } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Home, ChevronsUpDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

function Feedback({ params }) {
  const [feedbackList, setFeedbackList] = useState([]);
  const router = useRouter();

  useEffect(() => {
    GetRecentFeedback();
  }, []);

  const GetRecentFeedback = async () => {
    try {
      const result = await db
        .select()
        .from(UserAnswer)
        .orderBy(desc(UserAnswer.id)) // Get the latest 10 entries first
        .limit(10);

      // Reverse the array to display in ascending order
      const sortedResult = result.reverse();

      console.log("Fetched Recent 10 Questions in Ascending Order:", sortedResult);
      setFeedbackList(sortedResult);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  };

  const calculateOverallRating = () => {
    if (!feedbackList.length) return "N/A";

    const ratings = feedbackList
      .map((item) => parseFloat(item.rating))
      .filter((num) => !isNaN(num));

    if (!ratings.length) return "N/A";

    return (ratings.reduce((sum, val) => sum + val, 0) / ratings.length).toFixed(1);
  };

  return (
    <div className="min-h-screen h-full w-full bg-[#E6E6FA] flex flex-col items-center justify-center p-10">
      <div className="max-w-4xl w-full bg-white p-8 rounded-3xl shadow-lg border border-[#D8BFD8]">
        <h2 className="text-3xl font-bold text-[#7B2CBF]">🎉 Congratulations!</h2>
        <h2 className="text-2xl font-bold text-rose-600 mt-2">
          Here is your Interview Feedback
        </h2>

        {feedbackList.length === 0 ? (
          <h2 className="font-bold text-xl text-gray-500">
            No Interview Feedback Record Found
          </h2>
        ) : (
          <>
            <h2 className="text-lg text-[#7B2CBF] my-3">
              Your Overall Interview Rating:{" "}
              <strong className="text-rose-500">{calculateOverallRating()}/10</strong>
            </h2>
            <h2 className="text-sm text-gray-500">
              Below are the Interview Questions with Correct Answers, Your Answers, and Feedback for Improvement.
            </h2>

            {feedbackList.map((item, index) => (
              <Collapsible
                key={index}
                className="border border-purple-300 p-4 my-3 rounded-lg bg-[#D8BFD8] shadow-md"
              >
                <CollapsibleTrigger className="flex items-center justify-between font-semibold text-lg bg-rose-300 p-3 rounded-lg text-purple-900">
                  {item.question || "Untitled Question"}
                  <ChevronsUpDown className="h-5 w-5 text-purple-800" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-col gap-2 mt-2 p-3 bg-white rounded-lg shadow-sm">
                    <h2 className="text-rose-600 p-2 border border-rose-400 rounded-md">
                      <strong>⭐ Rating:</strong> {item.rating || "N/A"}
                    </h2>
                    <p className="text-purple-900">
                      <strong>✔ Correct Answer:</strong> {item.correctAns || "N/A"}
                    </p>
                    <p className="text-rose-600">
                      <strong>❌ Your Answer:</strong> {item.userAns || "N/A"}
                    </p>
                    <p className="text-gray-700">
                      <strong>💡 Feedback:</strong> {item.feedback || "No feedback provided"}
                    </p>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </>
        )}

        {/* Go Home Button */}
        <button
          onClick={() => router.push("/dashboard")}
          className="mt-10 px-6 py-3 bg-[#7B2CBF] text-white rounded-lg text-lg font-semibold hover:bg-[#6A1B9A] transition duration-300 flex items-center gap-2"
        >
          <Home className="w-6 h-6" /> Go Home
        </button>
      </div>
    </div>
  );
}

export default Feedback;
