"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { MockInterview } from "../../../../utils/schema";
import { db } from "../../../../utils/db"; 
import { eq } from "drizzle-orm"; 
import { Lightbulb, WebcamIcon, Briefcase, Layers, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Webcam from "react-webcam";
import Link from "next/link";


function Interview() {
  const params = useParams(); 
  const interviewId = params?.interviewId; 

  const [isMounted, setIsMounted] = useState(false); 
  const [interviewData, setInterviewData] = useState(null); 
  const [webCamEnabled, setWebCamEnabled] = useState(false);

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

      console.log("✅ Query Result:", result);

      if (result.length === 0) {
        console.warn("⚠️ No matching interview found!");
        setInterviewData(null);
      } else {
        setInterviewData(result[0]); 
      }
    } catch (error) {
      console.error("❌ Error fetching interview details:", error);
    }
  };

  if (!isMounted) return <div>Loading...</div>;

  return ( 
    <div className="my-10 min-h-screen flex flex-col items-center bg-[#F4EAF5] py-10 px-5">
      
      {/* Title */}
      <h2 className="font-bold text-3xl text-[#3D0066] mb-5 flex items-center gap-2">
        🚀 Let's Get Started!
      </h2>

      {/* Main Content Layout - Two Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-4xl">
        
        {/* LEFT: Interview Details */}
        <div className="flex flex-col my-5 gap-5">
          
          {/* Job Details */}
          <div className="flex flex-col p-5 rounded-lg border border-[#E6E6FA] bg-white shadow-lg gap-5">
            {interviewData ? (
              <>
                <h2 className="text-lg text-[#3D0066] flex items-center gap-2">
                  <Briefcase className="text-[#3D0066]" /> <strong>Job Role:</strong> {interviewData.jobPosition}
                </h2>
                <h2 className="text-lg text-[#3D0066] flex items-center gap-2">
                  <Layers className="text-[#3D0066]" /> <strong>Tech Stack:</strong> {interviewData.jobDesc}
                </h2>
                <h2 className="text-lg text-[#3D0066] flex items-center gap-2">
                  <Calendar className="text-[#3D0066]" /> <strong>Experience:</strong> {interviewData.jobExperience} years
                </h2>
              </>
            ) : (
              <h2 className="text-lg text-gray-500">🔍 Fetching Job Details...</h2>
            )}
          </div>

          {/* Information Box */}
          <div className='p-5 border border-[#E6E6FA] bg-[#F4EAF5] rounded-lg shadow-lg'>
            <h2 className='flex gap-2 items-center text-[#3D0066] font-semibold'>
              <Lightbulb className="text-[#3D0066]" />  Information
            </h2>
            <h2 className='mt-3 text-[#3D0066]'>
            Stay calm, speak clearly, and structure your answers well. Maintain eye contact with the camera!
            </h2>
          </div>

        </div>

        {/* RIGHT: Webcam Section */}
        <div className="flex flex-col items-center justify-center p-5 border border-[#E6E6FA] rounded-lg shadow-lg bg-white">
          {webCamEnabled ? (
            <Webcam 
              onUserMedia={() => setWebCamEnabled(true)}
              onUserMediaError={() => setWebCamEnabled(false)}
              mirrored={true}
              className="w-full h-64 rounded-lg"
            />
          ) : (
            <>
              <WebcamIcon className="h-48 w-48 my-5 p-5 bg-[#F4EAF5] rounded-lg border border-[#E6E6FA]"/>
              <Button 
                className="bg-[#3D0066] text-white py-2 px-5 rounded-lg mt-3 shadow-md hover:bg-[#2A004C]" 
                onClick={() => setWebCamEnabled(true)}
              >
                🎥 Enable Web Cam & Mic
              </Button>
            </>
          )}
        </div>

      </div>

      {/* Start Interview Button */}
      <div className='flex justify-end items-end w-full max-w-4xl mt-10'>
      <Link href={'/dashboard/interview/'+interviewId+'/start'}>
        <Button 
          className="bg-[#3D0066] text-white py-3 px-6 rounded-lg shadow-md text-lg font-semibold hover:bg-[#2A004C]">
          🚀 Start Interview
        </Button>
        </Link>
      </div>

    </div>
  );
}

export default Interview;
