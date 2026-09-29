export function maskEmail(email: string): string {
  const [localPart, domain] = email.split("@");

  const firstTwoPart = localPart.slice(0, 2);
  const lastTwoPart = localPart.slice(-2);
  const maskedPart = "*".repeat(localPart.length - 4);

  return `${firstTwoPart}${maskedPart}${lastTwoPart}@${domain}`;
}
