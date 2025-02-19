"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { MockInterview } from "@/utils/schema";
import { db } from "@/utils/db";
import { eq } from "drizzle-orm";
import QuestionsSection from "./_components/QuestionsSection";
import RecordAnswerSection from "./_components/RecordAnswerSection.";
import { Button } from "@/components/ui/button";
import Link from "next/link";



function Interview() {
  const [interviewData, setInterviewData] = useState(null);
  const [mockInterviewQuestions, setMockInterviewQuestions] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  const params = useParams();
  const interviewId = params?.interviewId;

  useEffect(() => {
    setIsMounted(true);
    if (interviewId) {
      fetchInterviewDetails();
    }
  }, [interviewId]);

  const fetchInterviewDetails = async () => {
    try {
      if (!interviewId) {
        console.error("❌ Interview ID is missing");
        return;
      }

      console.log("🔹 Fetching details for Interview ID:", interviewId);

      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, interviewId));

      if (!result || result.length === 0) {
        console.warn("⚠️ No matching interview found!");
        setInterviewData(null);
        return;
      }

      console.log("✅ Query Result:", result);

      let jsonMockResp = result[0]?.jsonMockResp;

      if (jsonMockResp) {
        try {
          jsonMockResp = JSON.parse(jsonMockResp);
          console.log("📌 Parsed jsonMockResp:", jsonMockResp); // ✅ Logs full JSON response
        } catch (error) {
          console.error("❌ Error parsing jsonMockResp:", error);
          jsonMockResp = [];
        }
      } else {
        jsonMockResp = [];
      }

      const parsedQuestions = Array.isArray(jsonMockResp) ? jsonMockResp : Object.values(jsonMockResp);
      console.log("📌 Interview Questions:", parsedQuestions); // ✅ Logs final array of questions

      setMockInterviewQuestions(parsedQuestions);
      setInterviewData(result[0]);

    } catch (error) {
      console.error("❌ Error fetching interview details:", error);
    }
  };

  if (!isMounted) return <div>Loading...</div>;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Questions Section */}
        <QuestionsSection 
          mockInterviewQuestions={mockInterviewQuestions}
          activeQuestionIndex={activeQuestionIndex}
        />

        {/* Video/Audio Recordings Section */}
        <RecordAnswerSection
          mockInterviewQuestions={mockInterviewQuestions}
          activeQuestionIndex={activeQuestionIndex}
          interviewData={interviewData}
        />
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-end gap-6">
       { activeQuestionIndex>0&& 
       <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex-1)}>Previous Question</Button>}
       { activeQuestionIndex!=mockInterviewQuestions?.length-1&& 
       <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex+1)}>Next Question</Button> }
        { activeQuestionIndex==mockInterviewQuestions?.length-1&& 
        <Link href={'/dashboard/interview/'+interviewData?.mockId+"/feedback"}>
        <Button>End Interview</Button>
        </Link>}
      </div>
    </div>
  );
}

export default Interview;