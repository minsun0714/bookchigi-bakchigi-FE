import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function BookCardSkeleton() {
  return (
    <Card>
      <CardContent className="flex flex-col p-4">
        <Skeleton className="mx-auto h-48 w-32 rounded-md" />
        <div className="mt-3 flex flex-col gap-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-1/4" />
          <Skeleton className="mt-2 h-4 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
