"use client"

import { RefreshCw } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

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
          <div className="prose prose-sm max-w-none 
            prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-gray-100
            prose-h1:text-lg prose-h2:text-base prose-h3:text-sm
            prose-p:text-sm prose-p:my-2
            prose-a:text-blue-600 dark:prose-a:text-blue-400
            prose-strong:font-bold
            prose-em:italic
            prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs
            prose-ul:list-disc prose-ul:ml-4 prose-ol:list-decimal prose-ol:ml-4
            prose-li:mb-1 prose-li:text-sm
            prose-blockquote:border-l-4 prose-blockquote:border-gray-200 dark:prose-blockquote:border-gray-700
            prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:my-2
            dark:prose-invert">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
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
