import { formatMsAsSsrTime } from "@/lib/ssr/time";
import { cn } from "@/lib/utils";

const sizes = {
  hero: "text-6xl md:text-7xl",
  lg: "text-4xl",
  md: "text-2xl",
  sm: "text-base",
} as const;

export function TimeDisplay({
  ms,
  size = "md",
  className,
}: {
  ms: number;
  size?: keyof typeof sizes;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "tnum font-mono font-medium tracking-tight text-foreground",
        sizes[size],
        className,
      )}
    >
      {formatMsAsSsrTime(ms)}
    </span>
  );
}
