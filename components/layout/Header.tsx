import Link from "next/link";

const NAV = [
  { href: "/rijders", label: "Rijders" },
  { href: "/ranglijsten", label: "Ranglijsten" },
  { href: "/records", label: "Records" },
  { href: "/wedstrijden", label: "Wedstrijden" },
  { href: "/vergelijk", label: "Vergelijk" },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 md:px-6">
        <Link
          href="/"
          className="font-display text-xl font-semibold tracking-tight text-foreground"
        >
          IJskoud
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground-muted transition-colors hover:bg-surface-raised hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/rijders"
          className="rounded-md border border-border-strong px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
        >
          Zoek rijder
        </Link>
      </div>
    </header>
  );
}
