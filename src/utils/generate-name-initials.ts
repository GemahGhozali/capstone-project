export function generateNameInitials(name: string): string {
  if (!name) return "";

  const words = name.trim().split(/\s+/);

  if (words.length === 0 || !words[0]) return "";

  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  const firstInitial = words[0].charAt(0);
  const secondInitial = words[1].charAt(0);

  return `${firstInitial}${secondInitial}`.toUpperCase();
}
