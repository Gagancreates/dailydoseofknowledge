import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export default function LoadingCard({ topic, promptType }: { topic: string; promptType: string }) {
  return (
    <Card className="h-full flex flex-col overflow-hidden border shadow-md">
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <Badge variant="outline" className="mb-1">
              {topic}
            </Badge>
            <div className="flex items-center">
              <span className="w-2 h-2 rounded-full mr-2 bg-blue-500"></span>
              <Badge>{promptType}</Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 px-4 py-2">
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </CardContent>
      <CardFooter className="pt-2 pb-4 px-4">
        <Skeleton className="h-8 w-20 ml-auto" />
      </CardFooter>
    </Card>
  )
}
