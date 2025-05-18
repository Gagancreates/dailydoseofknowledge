"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { ModeToggle } from "@/components/mode-toggle"
import TopicManager from "@/components/topic-manager"
import KnowledgeCards from "@/components/knowledge-cards"
import { getStoredTopics } from "@/lib/storage"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import StreakCounter from "@/components/StreakCounter"

export default function Home() {
  const [topics, setTopics] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [showTopicManager, setShowTopicManager] = useState<boolean>(false)
  const { theme } = useTheme()
  const { toast } = useToast()

  useEffect(() => {
    // Load topics from localStorage
    const storedTopics = getStoredTopics()
    setTopics(storedTopics)

    // Show topic manager if no topics are stored
    setShowTopicManager(storedTopics.length === 0)
    setIsLoading(false)
  }, [])

  return (
    <main className="min-h-screen">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-900 dark:to-indigo-900 text-white py-8 px-4 shadow-md">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Daily Dose of Knowledge</h1>
              <p className="text-blue-100 dark:text-blue-200">Your personal learning tutor with bite-sized knowledge</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-200"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">Learn something new every day</span>
              </div>
              <StreakCounter />
              <ModeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="my-8">
          {showTopicManager ? (
            <TopicManager
              topics={topics}
              setTopics={setTopics}
              onComplete={() => {
                setShowTopicManager(false)
                if (topics.length > 0) {
                  toast({
                    title: "Topics saved",
                    description: "Your learning topics have been saved.",
                  })
                }
              }}
            />
          ) : (
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Your Knowledge Cards</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowTopicManager(true)}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Manage Topics
                </button>
              </div>
            </div>
          )}
        </div>

        {!isLoading && !showTopicManager && <KnowledgeCards topics={topics} />}
      </div>
      <Toaster />
    </main>
  )
}
