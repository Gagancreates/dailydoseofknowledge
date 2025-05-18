"use client"

import type React from "react"
import { useState } from "react"
import { saveTopics } from "@/lib/storage"

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
    <div className="card bg-white rounded-xl shadow-md border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Manage Your Learning Topics</h2>
        {topics.length > 0 && onComplete && (
          <button onClick={onComplete} className="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Done
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2 mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTopic}
            onChange={(e) => {
              setNewTopic(e.target.value)
              setError("")
            }}
            onKeyDown={handleKeyDown}
            placeholder="Add a new topic (e.g., Machine Learning, React)"
            className="input flex-1"
          />
          <button onClick={handleAddTopic} className="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add Topic
          </button>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      {topics.length === 0 && (
        <div className="mb-6">
          <p className="text-gray-600 mb-3">Quick add from suggested topics:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedTopics.map((topic) => (
              <button
                key={topic}
                onClick={() => {
                  if (!topics.includes(topic)) {
                    const updatedTopics = [...topics, topic]
                    setTopics(updatedTopics)
                    saveTopics(updatedTopics)
                  } else {
                    setError("This topic already exists!")
                  }
                }}
                className="badge badge-blue"
              >
                {topic}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            ))}
          </div>
        </div>
      )}

      {topics.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-slate-700 mb-3">Your Topics:</h3>
          <div className="flex flex-wrap gap-2">
            {topics.map((topic) => (
              <div key={topic} className="badge badge-indigo flex items-center">
                <span>{topic}</span>
                <button
                  onClick={() => handleRemoveTopic(topic)}
                  className="ml-2 text-indigo-600 hover:text-indigo-800"
                  aria-label={`Remove ${topic}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
