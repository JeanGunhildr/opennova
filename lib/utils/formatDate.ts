export function formatTimestamp(dateStr?: string | null): string {
  if (!dateStr) {
    const now = new Date();
    return now.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).replace(".", ":");
  }

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Baru saja";

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).replace(".", ":");
}
