import { cn } from "@/lib/utils";

export function CountryCode({ code, className }: { code: string; className?: string }) {
  return (
    <span
      className={cn(
        "font-mono text-xs font-medium tracking-wider text-foreground-faint uppercase",
        className,
      )}
    >
      {code}
    </span>
  );
}
