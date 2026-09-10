export function ConfigBanner({ configured }: { configured: boolean }) {
  if (configured) return null;
  return (
    <div className="border-b border-line bg-brand-soft px-4 py-2 text-center text-sm text-brand-ink" role="status">
      Live ads appear after the marketplace database is connected. No sample listings are shown.
    </div>
  );
}
