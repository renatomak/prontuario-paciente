export function normalizeQuery(input: string): string {
  return (input || "").replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
}

export function isCpfQuery(input: string): boolean {
  const onlyDigits = (input || "").replace(/\D/g, "");
  return /^\d{11}$/.test(onlyDigits);
}
