"use client"

import { useState, useEffect, useCallback } from "react"
import { getPrompts } from "@/lib/prompts"
import { getTopicHistory, saveTopicHistory } from "@/lib/storage"
import { createHash } from "@/lib/utils"
import LoadingCard from "./loading-card"
import KnowledgeCard from "./knowledge-card"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent } from "@/components/ui/card"

interface KnowledgeCardsProps {
  topics: string[]
}

interface KnowledgeItem {
  id: string
  topic: string
  promptType: string
  content: string
  isLoading: boolean
  error?: string
}

export default function KnowledgeCards({ topics }: KnowledgeCardsProps) {
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const generateAllContent = useCallback(async () => {
    if (isGenerating) return
    setIsGenerating(true)

    try {
      // Create all placeholder items first
      const newItems: KnowledgeItem[] = topics.flatMap(topic => {
        const promptCount = Math.floor(Math.random() * 2) + 2 // 2 or 3
        const prompts = getPrompts(topic, promptCount)
        return prompts.map((prompt, index) => ({
          id: `${topic}-${Date.now()}-${index}`,
          topic,
          promptType: prompt.type,
          content: "",
          isLoading: true,
        }))
      })

      // Set all items at once
      setKnowledgeItems(newItems)

      // Generate content for each item sequentially
      for (const item of newItems) {
        try {
          const topicHistory = getTopicHistory(item.topic)
          const content = await generateContent(item.topic, item.promptType, topicHistory)
          const contentHash = createHash(content)
          saveTopicHistory(item.topic, contentHash)

          setKnowledgeItems(prev => 
            prev.map(prevItem => 
              prevItem.id === item.id 
                ? { ...prevItem, content, isLoading: false }
                : prevItem
            )
          )
        } catch (error) {
          console.error(`Error generating content for ${item.topic}:`, error)
          setKnowledgeItems(prev =>
            prev.map(prevItem =>
              prevItem.id === item.id
                ? {
                    ...prevItem,
                    isLoading: false,
                    error: error instanceof Error ? error.message : "Failed to generate content",
                  }
                : prevItem
            )
          )
        }
      }
    } catch (error) {
      console.error("Error in generateAllContent:", error)
      toast({
        variant: "destructive",
        title: "Error generating content",
        description: error instanceof Error ? error.message : "Failed to generate content",
      })
    } finally {
      setIsGenerating(false)
    }
  }, [topics, isGenerating, toast])

  // Only run on initial mount or when topics change
  useEffect(() => {
    if (topics.length > 0 && knowledgeItems.length === 0) {
      generateAllContent()
    }
  }, [topics, generateAllContent, knowledgeItems.length])

  const refreshCard = async (itemId: string) => {
    // Find the item to refresh
    const itemToRefresh = knowledgeItems.find((item) => item.id === itemId)
    if (!itemToRefresh) return

    // Set loading state
    setKnowledgeItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, isLoading: true, error: undefined } : item)),
    )

    try {
      const topicHistory = getTopicHistory(itemToRefresh.topic)
      const content = await generateContent(itemToRefresh.topic, itemToRefresh.promptType, topicHistory)

      // Create hash of the content to avoid duplicates
      const contentHash = createHash(content)

      // Save hash to history
      saveTopicHistory(itemToRefresh.topic, contentHash)

      // Update the item with new content
      setKnowledgeItems((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, content, isLoading: false } : item)),
      )

      toast({
        title: "Content refreshed",
        description: "New knowledge has been generated.",
      })
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

      toast({
        variant: "destructive",
        title: "Error refreshing content",
        description: error instanceof Error ? error.message : "Failed to refresh content",
      })
    }
  }

  // Function to generate content using our API route
  async function generateContent(topic: string, promptType: string, topicHistory: string[] = []): Promise<string> {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic,
        promptType,
        topicHistory,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to generate content")
    }

    const data = await response.json()
    return data.content
  }

  if (topics.length === 0) {
    return (
      <Card className="border shadow-md">
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <div className="rounded-full bg-primary/10 p-4 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-primary"
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
          </div>
          <h3 className="text-xl font-medium mb-2">No topics added yet</h3>
          <p className="text-muted-foreground mb-4">Add some topics to get your daily dose of knowledge!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button onClick={generateAllContent} disabled={isGenerating} className="flex items-center gap-2">
            {isGenerating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh All
              </>
            )}
          </Button>
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
