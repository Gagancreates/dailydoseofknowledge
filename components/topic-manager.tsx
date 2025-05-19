"use client"

import type React from "react"

import { useState } from "react"
import { saveTopics } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, X, Check, BookOpen } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface TopicManagerProps {
  topics: string[]
  setTopics: (topics: string[]) => void
  onComplete?: () => void
}

export default function TopicManager({ topics, setTopics, onComplete }: TopicManagerProps) {
  const [newTopic, setNewTopic] = useState("")
  const [error, setError] = useState("")

  const handleAddTopic = () => {
    const trimmedTopic = newTopic.trim()
    if (!trimmedTopic) {
      setError("Please enter a topic")
      return
    }
    if (topics.includes(trimmedTopic)) {
      setError("This topic already exists")
      return
    }
    if (topics.length >= 5) {
      setError("You can add up to 5 topics")
      return
    }

    const updatedTopics = [...topics, trimmedTopic]
    setTopics(updatedTopics)
    saveTopics(updatedTopics)
    setNewTopic("")
    setError("")
  }

  const handleRemoveTopic = (topicToRemove: string) => {
    const updatedTopics = topics.filter((topic) => topic !== topicToRemove)
    setTopics(updatedTopics)
    saveTopics(updatedTopics)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTopic()
    }
  }

  // Suggested topics for users to quickly add
  const suggestedTopics = [
    "Machine Learning",
    "JavaScript",
    "React",
    "Python",
    "Data Science",
    "System Design",
    "Algorithms",
  ]

  return (
    <Card className="border shadow-lg">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl sm:text-2xl font-bold">Manage Your Learning Topics</CardTitle>
            <CardDescription className="text-sm sm:text-base mt-1">Add topics you&apos;re interested in learning about</CardDescription>
          </div>
        </div>
        {topics.length > 0 && onComplete && (
          <Button onClick={onComplete} className="w-full sm:w-auto bg-primary hover:bg-primary/90">
            <Check className="mr-2 h-4 w-4" />
            Done
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Input
                type="text"
                value={newTopic}
                onChange={(e) => {
                  setNewTopic(e.target.value)
                  setError("")
                }}
                onKeyDown={handleKeyDown}
                placeholder="Add a new topic (e.g., Machine Learning, React)"
                className="flex-1 text-sm sm:text-base pr-24"
              />
              <Button 
                onClick={handleAddTopic} 
                className="absolute right-1 top-1 h-8 px-3 text-xs sm:text-sm"
                size="sm"
              >
                <PlusCircle className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                Add
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="py-2">
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          )}

          {topics.length === 0 && (
            <div className="mt-2">
              <p className="text-sm text-muted-foreground mb-3">Quick add from suggested topics:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedTopics.map((topic) => (
                  <Badge
                    key={topic}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-3 py-1.5"
                    onClick={() => {
                      if (!topics.includes(topic)) {
                        const updatedTopics = [...topics, topic]
                        setTopics(updatedTopics)
                        saveTopics(updatedTopics)
                      } else {
                        setError("This topic already exists!")
                      }
                    }}
                  >
                    {topic}
                    <PlusCircle className="ml-1 h-3 w-3" />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {topics.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-muted-foreground mb-3">Your selected topics:</p>
              <div className="flex flex-wrap gap-2">
                {topics.map((topic) => (
                  <Badge
                    key={topic}
                    variant="secondary"
                    className="px-3 py-1.5 text-sm flex items-center gap-1.5 bg-primary/10 hover:bg-primary/20 transition-colors"
                  >
                    {topic}
                    <button
                      onClick={() => handleRemoveTopic(topic)}
                      className="ml-1 hover:text-destructive transition-colors p-0.5 rounded-full hover:bg-destructive/10"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
