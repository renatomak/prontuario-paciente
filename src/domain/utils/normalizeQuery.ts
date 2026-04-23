export function normalizeQuery(query: string): string {
  return query.replace(/[^\w\d]/g, "").toUpperCase();
}

export function isCpfQuery(query: string): boolean {
  const onlyDigits = query.replace(/\D/g, "");
  return onlyDigits.length === 11;
}
