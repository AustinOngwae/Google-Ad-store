import { Skeleton } from "@/components/ui/skeleton";

interface AdSkeletonProps {
  width: string;
  height: string;
}

export const AdSkeleton = ({ width, height }: AdSkeletonProps) => {
  return (
    <div className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center" style={{ width, height }}>
      <Skeleton className="h-full w-full absolute inset-0" />
      <span className="relative z-10 text-sm text-gray-500 dark:text-gray-400">
        Loading Ad...
      </span>
    </div>
  );
};