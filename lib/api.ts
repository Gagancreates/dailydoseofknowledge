// Function to generate content using DeepSeek API
export async function generateContent(
    topic: string,
    promptType: string,
    apiKey: string,
    topicHistory: string[] = [],
  ): Promise<string> {
    try {
      // Get the prompt template based on the prompt type
      const promptIndex = getPromptIndexFromType(promptType)
      if (promptIndex === -1) {
        throw new Error(`Unknown prompt type: ${promptType}`)
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
        (topic: string) =>
          `Recommend an excellent learning resource (video, article, or GitHub) for ${topic}. Summarize it briefly.`,
        (topic: string) => `Explain a technical term in ${topic} in simple language. Give examples.`,
        (topic: string) =>
          `Pose a mini quiz: "Did you know?" in ${topic} with yes/no or fill-in-the-blank. Then explain the answer.`,
      ]
  
      const prompt = promptTemplates[promptIndex](topic)
  
      // Add history context if available
      let fullPrompt = prompt
      if (topicHistory.length > 0) {
        fullPrompt += `\n\nPlease provide unique content that is different from previous responses. Avoid generating content that would result in these hashes: ${topicHistory.join(", ")}`
      }
  
      // Call DeepSeek API
      const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content:
                "You are a knowledgeable tutor providing concise, accurate, and engaging educational content. Keep responses focused and under 300 words.",
            },
            {
              role: "user",
              content: fullPrompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      })
  
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || "Failed to generate content")
      }
  
      const data = await response.json()
      return data.choices[0].message.content.trim()
    } catch (error) {
      console.error("Error generating content:", error)
      throw error
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
      "Resource Recommendation",
      "Technical Term",
      "Mini Quiz",
    ]
  
    return promptTypes.findIndex((type) => type === promptType)
  }
  