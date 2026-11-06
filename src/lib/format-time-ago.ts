export function timeAgo(isoDate: string, locale: "en" | "bn" = "en"): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diffMs / 60_000);

  if (locale === "bn") {
    const formatter = new Intl.RelativeTimeFormat("bn-BD", { numeric: "auto" });
    if (minutes < 1) return "এইমাত্র";
    if (minutes < 60) return formatter.format(-minutes, "minute");

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return formatter.format(-hours, "hour");

    return formatter.format(-Math.floor(hours / 24), "day");
  }

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
