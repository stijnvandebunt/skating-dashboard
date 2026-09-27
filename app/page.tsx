import Link from "next/link";
import { TimeDisplay } from "@/components/ui/TimeDisplay";
import { CountryCode } from "@/components/ui/CountryCode";
import { StatTile } from "@/components/ui/StatTile";
import { TrackLines } from "@/components/ui/TrackLines";
import { mockTop5_500mMen, mockRecentRecords, mockQuickStats } from "@/lib/mock/homepage";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 pt-16 pb-12 md:px-6 md:pt-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight text-foreground md:text-6xl">
              Elke ronde,<br />
              elk record.
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-foreground-muted">
              Persoonlijke records, ranglijsten en wedstrijden van het
              langebaanschaatsen, overzichtelijk en snel doorzoekbaar.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/ranglijsten"
                className="rounded-md bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-transform active:scale-[0.98]"
              >
                Bekijk ranglijsten
              </Link>
              <Link
                href="/rijders"
                className="rounded-md border border-border-strong px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"
              >
                Zoek een rijder
              </Link>
            </div>
            <dl className="mt-12 flex flex-wrap gap-x-8 gap-y-4">
              {mockQuickStats.map((stat) => (
                <StatTile key={stat.label} label={stat.label} value={stat.value} />
              ))}
            </dl>
          </div>

          <div className="relative hidden lg:block">
            <TrackLines className="w-full text-foreground-faint" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border-strong bg-surface/90 px-5 py-4 text-center shadow-[0_0_0_1px_rgba(0,0,0,0.2)] backdrop-blur">
              <p className="text-xs font-medium text-foreground-muted">WR 500m</p>
              <TimeDisplay ms={33_610} size="lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Top 5 preview */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
            Seizoenstop 500m — mannen
          </h2>
          <Link href="/ranglijsten" className="text-sm font-medium text-accent hover:underline">
            Alle ranglijsten
          </Link>
        </div>
        <table className="mt-6 w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border text-xs font-medium text-foreground-faint">
              <th className="w-12 py-2 font-medium">#</th>
              <th className="py-2 font-medium">Rijder</th>
              <th className="py-2 font-medium">Land</th>
              <th className="py-2 text-right font-medium">Tijd</th>
            </tr>
          </thead>
          <tbody>
            {mockTop5_500mMen.map((row) => (
              <tr key={row.rank} className="border-b border-border last:border-b-0">
                <td className="py-3 font-mono text-sm text-foreground-faint">{row.rank}</td>
                <td className="py-3 text-sm font-medium text-foreground">{row.name}</td>
                <td className="py-3">
                  <CountryCode code={row.country} />
                </td>
                <td className="py-3 text-right">
                  <TimeDisplay ms={row.timeMs} size="sm" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Recent records */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
          Recente records
        </h2>
        <div className="mt-6 grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-3">
          {mockRecentRecords.map((record) => (
            <div key={`${record.type}-${record.distance}`} className="bg-surface p-5">
              <div className="flex items-center gap-2">
                <span className="rounded bg-accent-muted px-1.5 py-0.5 font-mono text-[11px] font-semibold text-accent">
                  {record.type}
                </span>
                <span className="text-xs text-foreground-faint">{record.distance}m</span>
              </div>
              <TimeDisplay ms={record.timeMs} size="md" className="mt-3 block" />
              <p className="mt-2 text-sm text-foreground-muted">{record.name}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
