export async function generateFeedback(question, userAns) {
    const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!API_KEY) {
      console.error("Gemini API Key is missing!");
      return { rating: "N/A", feedback: "API key missing" };
    }
  
    const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateText?key=${API_KEY}`;
  
    const prompt = `Evaluate the following interview answer:\n\n
    Question: ${question}\n
    User Answer: ${userAns}\n
    Provide a rating (0-10) and a constructive feedback. Format it as JSON:
    { "rating": <number>, "feedback": "<text>" }`;
  
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
  
      const data = await response.json();
  
      if (!data.candidates || data.candidates.length === 0) {
        return { rating: "N/A", feedback: "Error in response from Gemini API" };
      }
  
      const parsedData = JSON.parse(data.candidates[0].content);
  
      return {
        rating: parsedData.rating || "N/A",
        feedback: parsedData.feedback || "No feedback provided",
      };
    } catch (error) {
      console.error("Gemini API Error:", error);
      return { rating: "N/A", feedback: "Error generating feedback" };
    }
  }
  