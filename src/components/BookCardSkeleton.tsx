import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function BookCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="bg-muted/50 flex items-center justify-center p-6">
        <Skeleton className="h-44 w-28 rounded" />
      </div>
      <div className="flex flex-col gap-2 p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="mt-1 h-3 w-full" />
      </div>
    </Card>
  );
}
