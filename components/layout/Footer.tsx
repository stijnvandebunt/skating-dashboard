export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-foreground-faint md:flex-row md:items-center md:justify-between md:px-6">
        <p>
          Data van{" "}
          <a
            href="https://speedskatingresults.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground-muted underline decoration-border-strong underline-offset-4 hover:text-accent"
          >
            SpeedskatingResults.com
          </a>
          .
        </p>
        <p>IJskoud is een onafhankelijk project, niet-commercieel.</p>
      </div>
    </footer>
  );
}
