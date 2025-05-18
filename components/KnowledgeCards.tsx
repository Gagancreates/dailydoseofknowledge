"use client"

import { useState, useEffect } from "react"
import { getPrompts } from "@/lib/prompts"
import { generateContent } from "@/lib/api"
import { getTopicHistory, saveTopicHistory } from "@/lib/storage"
import { createHash } from "@/lib/utils"
import LoadingCard from "./LoadingCard"
import KnowledgeCard from "./KnowledgeCard"

interface KnowledgeCardsProps {
  topics: string[]
  apiKey: string
}

interface KnowledgeItem {
  id: string
  topic: string
  promptType: string
  content: string
  isLoading: boolean
  error?: string
}

export default function KnowledgeCards({ topics, apiKey }: KnowledgeCardsProps) {
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    if (topics.length > 0 && apiKey) {
      generateAllContent()
    } else {
      setKnowledgeItems([])
    }
  }, [topics, apiKey])

  const generateAllContent = async () => {
    if (isGenerating || !apiKey) return
    setIsGenerating(true)

    // Clear existing items
    setKnowledgeItems([])

    // Generate new content for each topic
    const newItems: KnowledgeItem[] = []

    for (const topic of topics) {
      // Get 2-3 random prompts for this topic
      const promptCount = Math.floor(Math.random() * 2) + 2 // 2 or 3
      const prompts = getPrompts(topic, promptCount)

      // Create placeholder items
      const topicItems = prompts.map((prompt, index) => ({
        id: `${topic}-${Date.now()}-${index}`,
        topic,
        promptType: prompt.type,
        content: "",
        isLoading: true,
      }))

      newItems.push(...topicItems)
    }

    setKnowledgeItems(newItems)

    // Generate content for each item
    for (const item of newItems) {
      try {
        const topicHistory = getTopicHistory(item.topic)
        const content = await generateContent(item.topic, item.promptType, apiKey, topicHistory)

        // Create hash of the content to avoid duplicates
        const contentHash = createHash(content)

        // Save hash to history
        saveTopicHistory(item.topic, contentHash)

        // Update the item with content
        setKnowledgeItems((prev) =>
          prev.map((prevItem) => (prevItem.id === item.id ? { ...prevItem, content, isLoading: false } : prevItem)),
        )
      } catch (error) {
        console.error(`Error generating content for ${item.topic}:`, error)
        setKnowledgeItems((prev) =>
          prev.map((prevItem) =>
            prevItem.id === item.id
              ? {
                  ...prevItem,
                  isLoading: false,
                  error: error instanceof Error ? error.message : "Failed to generate content",
                }
              : prevItem,
          ),
        )
      }
    }

    setIsGenerating(false)
  }

  const refreshCard = async (itemId: string) => {
    // Find the item to refresh
    const itemToRefresh = knowledgeItems.find((item) => item.id === itemId)
    if (!itemToRefresh || !apiKey) return

    // Set loading state
    setKnowledgeItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, isLoading: true, error: undefined } : item)),
    )

    try {
      const topicHistory = getTopicHistory(itemToRefresh.topic)
      const content = await generateContent(itemToRefresh.topic, itemToRefresh.promptType, apiKey, topicHistory)

      // Create hash of the content to avoid duplicates
      const contentHash = createHash(content)

      // Save hash to history
      saveTopicHistory(itemToRefresh.topic, contentHash)

      // Update the item with new content
      setKnowledgeItems((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, content, isLoading: false } : item)),
      )
    } catch (error) {
      console.error(`Error refreshing content:`, error)
      setKnowledgeItems((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? {
                ...item,
                isLoading: false,
                error: error instanceof Error ? error.message : "Failed to refresh content",
              }
            : item,
        ),
      )
    }
  }

  if (topics.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 text-center">
        <div className="flex flex-col items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-gray-300 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p className="text-gray-600 mb-4">Add some topics to get your daily dose of knowledge!</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            Add Topics
          </button>
        </div>
      </div>
    )
  }

  if (!apiKey) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 text-center">
        <div className="flex flex-col items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-gray-300 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
            />
          </svg>
          <p className="text-gray-600">Please set your DeepSeek API key to generate content.</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button
            onClick={generateAllContent}
            disabled={isGenerating}
            className="btn btn-primary flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clipRule="evenodd"
                  />
                </svg>
                Refresh All
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {knowledgeItems.map((item) =>
          item.isLoading ? (
            <LoadingCard key={item.id} topic={item.topic} promptType={item.promptType} />
          ) : (
            <KnowledgeCard
              key={item.id}
              id={item.id}
              topic={item.topic}
              promptType={item.promptType}
              content={item.content}
              error={item.error}
              onRefresh={refreshCard}
            />
          ),
        )}
      </div>
    </div>
  )
}
