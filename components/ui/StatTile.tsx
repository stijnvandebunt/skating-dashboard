import { cn } from "@/lib/utils";

export function StatTile({
  label,
  value,
  detail,
  className,
}: {
  label: string;
  value: React.ReactNode;
  detail?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 border-l border-border py-1 pl-4 first:border-l-0 first:pl-0",
        className,
      )}
    >
      <span className="text-xs font-medium text-foreground-muted">{label}</span>
      <span className="font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
        {value}
      </span>
      {detail && <span className="text-sm text-foreground-faint">{detail}</span>}
    </div>
  );
}
