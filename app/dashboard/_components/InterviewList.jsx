"use client";

import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq, desc } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs"; // ✅ Import user auth hook (adjust if using a different auth provider)
import InterviewItemCard from "./InterviewItemCard";

function InterviewList() {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);

  useEffect(() => {
    if (user) {
      GetInterviewList();
    }
  }, [user]);

  const GetInterviewList = async () => {  // ✅ Added async
    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress))
        .orderBy(desc(MockInterview.id));

      console.log("Fetched Interviews:", result);  // ✅ Logs in console
      setInterviewList(result);  // ✅ Stores in state
    } catch (error) {
      console.error("Error fetching interview list:", error);
    }
  };

  return (
    <div>
      <h2 className="font-medium text-xl">Previous Mock Interviews</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3'>
        {interviewList&&interviewList.map((interview,index)=>(
            <InterviewItemCard 
            interview={interview}
            key={index}/>


        ))}
      </div>
    </div>
  );
}

export default InterviewList;
