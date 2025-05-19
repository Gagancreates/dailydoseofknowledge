import { NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"

// Use the specific Google API key environment variable
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || process.env.API_KEY

export async function POST(request: Request) {
  try {
    // Validate API key
    if (!GOOGLE_API_KEY) {
      console.error("Google Gemini API key is missing")
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }
    
    const { topic, promptType, topicHistory } = await request.json()
    console.log("Request received:", { topic, promptType })

    // Get the prompt template based on the prompt type
    const promptIndex = getPromptIndexFromType(promptType)
    if (promptIndex === -1) {
      return NextResponse.json({ error: `Unknown prompt type: ${promptType}` }, { status: 400 })
    }

    const promptTemplates = [
      (topic: string) =>
        `You're a senior mentor. Teach one underrated but powerful concept in ${topic}. Explain it with a real-world analogy.`,
      (topic: string) =>
        `Ask a challenging conceptual MCQ in ${topic}. Give 4 options, the correct answer, and a short explanation.`,
      (topic: string) =>
        `Give a coding or logical challenge in ${topic} that takes <5 min. Include what to do and sample output.`,
      (topic: string) =>
        `Reveal one myth or common mistake in ${topic}. Explain why it's wrong and what to do instead.`,
      (topic: string) =>
        `Share a bite-sized historical story, origin, or fun fact about ${topic} that deepens understanding.`,
      (topic: string) => `Create a "what if?" scenario in ${topic} and walk the learner through the outcome.`,
      (topic: string) => `Give a pro tip or trick in ${topic} that most beginners miss. Explain clearly.`,
      (topic: string) => `Explain a technical term in ${topic} in simple language. Give examples.`,
      (topic: string) =>
        `Pose a mini quiz: "Did you know?" in ${topic} with yes/no or fill-in-the-blank. Then explain the answer.`,
    ]

    const prompt = promptTemplates[promptIndex](topic)

    // Add history context if available
    let fullPrompt = prompt
    if (topicHistory && topicHistory.length > 0) {
      fullPrompt += `\n\nPlease provide unique content that is different from previous responses. Avoid generating content that would result in these hashes: ${topicHistory.join(", ")}`
    }

    try {
      console.log("Initializing Google GenAI...")
      // Initialize with the correct API key
      const genAI = new GoogleGenAI({ apiKey: GOOGLE_API_KEY })
      
      // Simple prompt for Gemini
      console.log("Calling Gemini API...")
      const result = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: fullPrompt
      })
      
      if (!result || !result.text) {
        console.error("Empty response from Gemini API")
        return NextResponse.json({ error: "No content generated" }, { status: 500 })
      }

      return NextResponse.json({ content: result.text.trim() })
    } catch (apiError: Error | unknown) {
      console.error("API call error details:", 
        apiError instanceof Error ? apiError.message : "Unknown API error"
      )
      
      // Check for specific API key errors
      const errorMessage = apiError instanceof Error ? apiError.message : "";
      if (errorMessage.includes("API key not valid") || errorMessage.includes("INVALID_ARGUMENT")) {
        console.error("API KEY INVALID - Check your GOOGLE_API_KEY environment variable")
        return NextResponse.json({ 
          error: "Invalid API key. Please configure a valid Google API key." 
        }, { status: 401 })
      }
      
      return NextResponse.json({ 
        error: `Gemini API error: ${apiError instanceof Error ? apiError.message : "Unknown error"}` 
      }, { status: 500 })
    }
  } catch (error: Error | unknown) {
    console.error("Error generating content:", 
      error instanceof Error ? error.message : "Unknown error"
    )
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 })
  }
}

// Helper function to get prompt index from type
function getPromptIndexFromType(promptType: string): number {
  const promptTypes = [
    "Powerful Concept",
    "Challenging MCQ",
    "Coding Challenge",
    "Myth Buster",
    "Historical Insight",
    "What If Scenario",
    "Pro Tip",
    "Technical Term",
    "Mini Quiz",
  ]

  return promptTypes.findIndex((type) => type === promptType)
}
