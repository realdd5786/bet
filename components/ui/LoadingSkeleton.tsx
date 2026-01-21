import clsx from "clsx";

interface LoadingSkeletonProps {
  className?: string;
}

export function LoadingSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div
      className={clsx(
        "h-4 w-full animate-pulse rounded-full bg-white/10",
        className
      )}
    />
  );
}
