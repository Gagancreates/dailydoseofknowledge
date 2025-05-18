"use client"

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
  const getBadgeColor = (type: string) => {
    const types = {
      "Powerful Concept": "badge-blue",
      "Challenging MCQ": "badge-indigo",
      "Coding Challenge": "badge-purple",
      "Myth Buster": "badge-blue",
      "Historical Insight": "badge-indigo",
      "What If Scenario": "badge-purple",
      "Pro Tip": "badge-blue",
      "Resource Recommendation": "badge-indigo",
      "Technical Term": "badge-purple",
      "Mini Quiz": "badge-blue",
    }
    return types[type as keyof typeof types] || "badge-blue"
  }

  return (
    <div className="card h-full flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="badge badge-blue mb-2">{topic}</span>
          <h3 className={`font-medium text-slate-800 flex items-center ${getBadgeColor(promptType)}`}>
            <span
              className={`w-2 h-2 rounded-full mr-2 ${promptType === "Powerful Concept" ? "bg-blue-500" : promptType === "Challenging MCQ" ? "bg-indigo-500" : "bg-purple-500"}`}
            ></span>
            {promptType}
          </h3>
        </div>
        <button
          onClick={() => onRefresh(id)}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
          aria-label="Refresh card"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>

      <div className="flex-1">
        {error ? (
          <div className="text-red-600 p-4 bg-red-50 rounded-md">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : (
          <div className="prose prose-sm max-w-none">
            {content.split("\n").map((paragraph, index) => (
              <p key={index} className="mb-2 text-gray-700">
                {paragraph}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
