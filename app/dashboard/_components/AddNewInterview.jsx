"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // ✅ Fixed missing import
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MockInterview } from "../../../utils/schema";
import { v4 as uuidv4 } from "uuid";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { chatSession } from "../../../utils/GeminiAIModal";
import { LoaderCircle } from "lucide-react";
import { db } from "../../../utils/db";
import { useUser } from "@clerk/nextjs";
import moment from "moment/moment";

function AddNewInterview() {
    const [openDialog, setOpenDialog] = useState(false);
    const [jobPosition, setJobPosition] = useState("");
    const [jobDesc, setJobDesc] = useState("");
    const [jobExperience, setJobExperience] = useState("");
    const [loading, setLoading] = useState(false);
    const [jsonResponse, setJsonResponse] = useState([]);
    const router = useRouter();
    const { user } = useUser();
    
    // ✅ Fix Hydration Issue: Ensure values only update in the client
    const [currentDate, setCurrentDate] = useState("");

    useEffect(() => {
        setCurrentDate(moment().format("YYYY-MM-DD HH:mm:ss")); // Fix for SSR mismatch
    }, []);

    const onSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        console.log(jobPosition, jobDesc, jobExperience);

        const questionCount =
            process.env.NEXT_PUBLIC_INTERVIEW_QUESTIONS_COUNT || "10";
        const InputPrompt = `Job position: ${jobPosition}, Job Description: ${jobDesc}, Years of Experience: ${jobExperience}. Generate ${questionCount} interview questions with answers in JSON format.`;

        let MockJsonResp = ""; // ✅ Declare MockJsonResp outside of try/catch

        try {
            const result = await chatSession.sendMessage(InputPrompt);
            const responseText = await result.response.text();
            MockJsonResp = responseText
                .replace("```json", "")
                .replace("```", "");

            const parsedJson = JSON.parse(MockJsonResp);
            setJsonResponse(parsedJson);
            console.log(parsedJson);
        } catch (error) {
            console.error("Error fetching AI response:", error);
            setJsonResponse([]); // ✅ Reset response in case of error
            MockJsonResp = ""; // ✅ Ensure it's empty in case of failure
        }

        if (MockJsonResp) {
            try {
                const resp = await db
                    .insert(MockInterview)
                    .values({
                        mockId: uuidv4(),
                        jsonMockResp: MockJsonResp,
                        jobPosition: jobPosition,
                        jobDesc: jobDesc,
                        jobExperience: jobExperience,
                        createdBy: user?.primaryEmailAddress?.emailAddress,
                        createdAt: currentDate, // ✅ Fix: Uses client-generated date
                    })
                    .returning({ mockId: MockInterview.mockId });

                console.log("Inserted ID:", resp);
                if (resp) {
                    setOpenDialog(false); // ✅ Close dialog only if insert is successful
                    router.push("/dashboard/interview/" + resp[0]?.mockId);
                }
            } catch (dbError) {
                console.error("Database insert error:", dbError);
            }
        } else {
            console.log("Error: MockJsonResp is empty.");
        }

        setLoading(false);
    };

    return (
        <div>
            <div
                className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
                onClick={() => setOpenDialog(true)}
            >
                <h2 className="text-lg text-center">+ Add New</h2>
            </div>

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">
                            Tell us more about your Job Interviewing
                        </DialogTitle>
                        <DialogDescription>
                            Add details about your job position/role, job
                            description, and years of experience.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={onSubmit}>
                        <div className="mt-7 my-3">
                            <label>Job Role/Job Position</label>
                            <Input
                                placeholder="Ex. AI/ML Developer, Full Stack Developer, Data Analyst etc."
                                required
                                value={jobPosition}
                                onChange={(event) =>
                                    setJobPosition(event.target.value)
                                }
                            />
                        </div>

                        <div className="my-3">
                            <label>Job Description/Tech Stack (In Short)</label>
                            <Textarea
                                placeholder="Ex. React, Python, Java etc."
                                required
                                value={jobDesc}
                                onChange={(event) =>
                                    setJobDesc(event.target.value)
                                }
                            />
                        </div>

                        <div className="my-3">
                            <label>Years of Experience</label>
                            <Input
                                placeholder="Ex. 5"
                                type="number"
                                max="25"
                                required
                                value={jobExperience}
                                onChange={(event) =>
                                    setJobExperience(event.target.value)
                                }
                            />
                        </div>

                        <div className="mt-4 flex justify-end space-x-2">
                            <Button type="button" onClick={() => setOpenDialog(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? (
                                    <>
                                        <LoaderCircle className="animate-spin" />{" "}
                                        Generating from AI...
                                    </>
                                ) : (
                                    "Start Interview"
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default AddNewInterview;
