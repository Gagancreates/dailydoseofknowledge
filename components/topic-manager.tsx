"use client"

import type React from "react"

import { useState } from "react"
import { saveTopics } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, X, Check } from "lucide-react"
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
    if (!newTopic.trim()) {
      setError("Please enter a topic")
      return
    }

    // Check if topic already exists
    if (topics.includes(newTopic.trim())) {
      setError("This topic already exists!")
      return
    }

    setError("")
    const updatedTopics = [...topics, newTopic.trim()]
    setTopics(updatedTopics)
    saveTopics(updatedTopics)
    setNewTopic("")
  }

  const handleRemoveTopic = (topicToRemove: string) => {
    const updatedTopics = topics.filter((topic) => topic !== topicToRemove)
    setTopics(updatedTopics)
    saveTopics(updatedTopics)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
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
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-2xl font-bold">Manage Your Learning Topics</CardTitle>
          <CardDescription>Add topics you're interested in learning about</CardDescription>
        </div>
        {topics.length > 0 && onComplete && (
          <Button onClick={onComplete} className="ml-auto">
            <Check className="mr-2 h-4 w-4" />
            Done
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Input
              type="text"
              value={newTopic}
              onChange={(e) => {
                setNewTopic(e.target.value)
                setError("")
              }}
              onKeyDown={handleKeyDown}
              placeholder="Add a new topic (e.g., Machine Learning, React)"
              className="flex-1"
            />
            <Button onClick={handleAddTopic}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Topic
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
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
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
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
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-3">Your Topics:</h3>
              <div className="flex flex-wrap gap-2">
                {topics.map((topic) => (
                  <Badge key={topic} variant="secondary" className="flex items-center gap-1 px-3 py-1.5">
                    <span>{topic}</span>
                    <button
                      onClick={() => handleRemoveTopic(topic)}
                      className="ml-1 text-muted-foreground hover:text-foreground rounded-full"
                      aria-label={`Remove ${topic}`}
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
