"use client";

import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5E1FD] px-6 py-10">
      <h2 className="text-4xl font-extrabold text-[#7B2CBF] mb-6 shadow-md px-6 py-3 bg-[#FFD6EC] rounded-2xl">
        AI Interview Mocker
      </h2>

      <Button
        className="mt-4 px-6 py-3 bg-[#7B2CBF] text-white rounded-lg text-lg font-semibold hover:bg-[#6A1B9A] transition duration-300"
        onClick={() => router.push("/dashboard")}
      >
        Click to Proceed
      </Button>
    </div>
  );
}
