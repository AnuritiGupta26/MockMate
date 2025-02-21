import React, { useState } from "react";
import { Lightbulb, Volume2 } from "lucide-react";

function QuestionsSection({ mockInterviewQuestions, activeQuestionIndex }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechSynthesisRef = React.useRef(null);

  const textToSpeech = (text) => {
    if (!("speechSynthesis" in window)) {
      alert("Sorry, your browser does not support text-to-speech.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel(); // Stop speaking
      setIsSpeaking(false);
    } else {
      const speech = new SpeechSynthesisUtterance(text);
      speechSynthesisRef.current = speech;
      window.speechSynthesis.speak(speech);
      setIsSpeaking(true);

      // When speech ends, reset state
      speech.onend = () => {
        setIsSpeaking(false);
      };
    }
  };

  return (
    mockInterviewQuestions && (
      <div className="p-6 rounded-lg my-10 bg-gradient-to-br from-pink-200 to-purple-300 shadow-xl">
        <h2 className="text-2xl font-bold text-purple-800 text-center mb-6">
          Interview Questions
        </h2>

        {/* Question Numbers (Side by Side) */}
        <div className="flex flex-wrap gap-4 justify-center w-full px-5 py-4">
          {mockInterviewQuestions.map((item, index) => (
            <h3
              key={index}
              className={`px-6 py-3 rounded-full shadow-md text-lg text-center transition-all duration-300 
                ${
                  activeQuestionIndex === index
                    ? "bg-purple-600 text-white scale-105"
                    : "bg-pink-400 text-white hover:bg-pink-500"
                }`}
            >
              Question #{index + 1}
            </h3>
          ))}
        </div>

        {/* Active Question */}
        <h2 className="my-6 text-lg text-purple-900 text-center font-medium">
          {mockInterviewQuestions[activeQuestionIndex]?.question}
        </h2>

        {/* ✅ Toggle Speech on Click */}
        <Volume2
          className={`cursor-pointer transition ${
            isSpeaking ? "text-red-600 animate-pulse" : "text-purple-600 hover:text-purple-800"
          }`}
          onClick={() => textToSpeech(mockInterviewQuestions[activeQuestionIndex]?.question)}
        />

        {/* Note Section */}
        <div className="border rounded-lg p-5 bg-purple-100 shadow-lg mt-10">
          <h2 className="flex gap-3 items-center text-purple-800 font-semibold text-lg">
            <Lightbulb className="w-6 h-6 text-yellow-500" />
            <strong>NOTE:</strong>
          </h2>
          <p className="text-md text-gray-800 mt-2">
            Click on <strong>Record Answer</strong> and open the webcam when you want to answer the question.It is mandatory to answer all questions. Be clear, speak loudly, and stay calm.
          </p>
        </div>
      </div>
    )
  );
}

export default QuestionsSection;
