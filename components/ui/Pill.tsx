import { cn } from "@/lib/utils";

export function Pill({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "accent";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium",
        tone === "neutral" &&
          "border-border-strong bg-surface-raised text-foreground-muted",
        tone === "accent" && "border-transparent bg-accent-muted text-accent",
        className,
      )}
    >
      {children}
    </span>
  );
}
