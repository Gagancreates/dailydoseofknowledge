// Prompt templates as provided
const promptTemplates = [
    (topic: string) =>
      `Teach one underrated but powerful concept in ${topic}. Explain it with a real-world analogy.`,
    (topic: string) =>
      `Ask a challenging conceptual MCQ in ${topic}. Give 4 options, the correct answer, and a short explanation.`,
    (topic: string) =>
      `Give a coding or logical challenge in ${topic} that takes <5 min. Include what to do and sample output.`,
    (topic: string) => `Reveal one myth or common mistake in ${topic}. Explain why it's wrong and what to do instead.`,
    (topic: string) =>
      `Share a bite-sized historical story, origin, or fun fact about ${topic} that deepens understanding.`,
    (topic: string) => `Create a "what if?" scenario in ${topic} and walk the learner through the outcome.`,
    (topic: string) => `Give a pro tip or trick in ${topic} that most people miss. Explain clearly.`,
    (topic: string) => `Explain a technical term in ${topic} in simple language. Give examples.`,
    (topic: string) =>
      `Pose a mini quiz: "Did you know?" in ${topic} with yes/no or fill-in-the-blank. Then explain the answer.`,
  ]
  
  // Prompt types for display
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
  
  // Fisher-Yates shuffle algorithm
  function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }
  
  // Get random prompts for a topic
  export function getPrompts(topic: string, count = 3) {
    // Create array of indices
    const indices = Array.from({ length: promptTemplates.length }, (_, i) => i)
  
    // Shuffle indices
    const shuffledIndices = shuffleArray(indices)
  
    // Take the first 'count' indices
    const selectedIndices = shuffledIndices.slice(0, Math.min(count, promptTemplates.length))
  
    // Return selected prompts with their types
    return selectedIndices.map((index) => ({
      prompt: promptTemplates[index](topic),
      type: promptTypes[index],
    }))
  }
  