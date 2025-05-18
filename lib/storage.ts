// Maximum number of hashes to store per topic
const MAX_HISTORY_SIZE = 5

// Get topics from localStorage
export function getStoredTopics(): string[] {
  if (typeof window === "undefined") return []

  const storedTopics = localStorage.getItem("dailyKnowledge_topics")
  return storedTopics ? JSON.parse(storedTopics) : []
}

// Save topics to localStorage
export function saveTopics(topics: string[]): void {
  if (typeof window === "undefined") return

  localStorage.setItem("dailyKnowledge_topics", JSON.stringify(topics))
}

// Get content history for a topic
export function getTopicHistory(topic: string): string[] {
  if (typeof window === "undefined") return []

  const key = `dailyKnowledge_history_${topic}`
  const storedHistory = localStorage.getItem(key)
  return storedHistory ? JSON.parse(storedHistory) : []
}

// Save content hash to topic history
export function saveTopicHistory(topic: string, contentHash: string): void {
  if (typeof window === "undefined") return

  const key = `dailyKnowledge_history_${topic}`
  const history = getTopicHistory(topic)

  // Add new hash and keep only the most recent MAX_HISTORY_SIZE
  const updatedHistory = [contentHash, ...history.filter((hash) => hash !== contentHash)].slice(0, MAX_HISTORY_SIZE)

  localStorage.setItem(key, JSON.stringify(updatedHistory))
}

// Save API Key to localStorage
export function saveAPIKey(apiKey: string): void {
  if (typeof window === "undefined") return

  localStorage.setItem("dailyKnowledge_apiKey", apiKey)
}
