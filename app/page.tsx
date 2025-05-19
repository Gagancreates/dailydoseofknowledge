"use client"

import { useState, useEffect } from "react"
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
    <main className="min-h-screen bg-background">
      <header className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900 text-white py-8 sm:py-12 px-4 shadow-lg overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        <div className="container mx-auto max-w-6xl relative">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left w-full md:w-auto">
              <h1 className="text-4xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-3 font-['ZT_Formom'] tracking-tight">
                Daily Dose of Knowledge
              </h1>
              <p className="text-blue-100 dark:text-blue-200 text-base sm:text-lg font-medium">
                Your personal learning tutor with bite-sized knowledge
              </p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end items-center gap-3 sm:gap-4 w-full md:w-auto">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-white/20 w-full sm:w-auto justify-center md:justify-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-5 sm:w-5 text-blue-200"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-xs sm:text-sm font-medium">Learn something new every day</span>
              </div>
              <div className="flex items-center gap-3 sm:gap-4">
                <StreakCounter />
                <ModeToggle />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
        <div className="my-6 sm:my-8">
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">Your Knowledge Cards</h2>
              <div className="w-full sm:w-auto">
                <button
                  onClick={() => setShowTopicManager(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-5 sm:w-5 mr-2"
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
