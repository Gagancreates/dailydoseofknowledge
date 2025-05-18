"use client"

import { RefreshCw } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface KnowledgeCardProps {
  id: string
  topic: string
  promptType: string
  content: string
  error?: string
  onRefresh: (id: string) => void
}

export default function KnowledgeCard({ id, topic, promptType, content, error, onRefresh }: KnowledgeCardProps) {
  // Function to get badge color based on prompt type
  const getBadgeVariant = (type: string) => {
    const types: Record<string, "default" | "secondary" | "outline"> = {
      "Powerful Concept": "default",
      "Challenging MCQ": "secondary",
      "Coding Challenge": "outline",
      "Myth Buster": "default",
      "Historical Insight": "secondary",
      "What If Scenario": "outline",
      "Pro Tip": "default",
      "Resource Recommendation": "secondary",
      "Technical Term": "outline",
      "Mini Quiz": "default",
    }
    return types[type] || "default"
  }

  return (
    <Card className="h-full flex flex-col overflow-hidden border shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <Badge variant="outline" className="mb-1">
              {topic}
            </Badge>
            <div className="flex items-center">
              <span
                className={`w-2 h-2 rounded-full mr-2 ${
                  promptType === "Powerful Concept"
                    ? "bg-blue-500"
                    : promptType === "Challenging MCQ"
                      ? "bg-indigo-500"
                      : "bg-purple-500"
                }`}
              ></span>
              <Badge variant={getBadgeVariant(promptType)}>{promptType}</Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 px-4 py-2">
        {error ? (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {content.split("\n").map((paragraph, index) => (
              <p key={index} className="mb-2 text-sm">
                {paragraph}
              </p>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2 pb-4 px-4">
        <Button variant="ghost" size="sm" onClick={() => onRefresh(id)} className="ml-auto text-xs">
          <RefreshCw className="mr-1 h-3 w-3" />
          Refresh
        </Button>
      </CardFooter>
    </Card>
  )
}
