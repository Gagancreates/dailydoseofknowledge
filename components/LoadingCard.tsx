export default function LoadingCard({ topic, promptType }: { topic: string; promptType: string }) {
    return (
      <div className="card h-full">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="badge badge-blue mb-2">{topic}</span>
            <h3 className="font-medium text-slate-800 flex items-center">
              <span className="w-2 h-2 rounded-full mr-2 bg-blue-500"></span>
              {promptType}
            </h3>
          </div>
        </div>
  
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }
  