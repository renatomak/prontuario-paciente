export function pick<T>(...vals: (T | null | undefined)[]): T | null {
  for (const v of vals) {
    if (v !== undefined && v !== null && v !== "") return v as T;
  }
  return null;
}

export function asBool(v: unknown): boolean {
  if (typeof v === "boolean") return v;
  if (typeof v === "string")
    return v.toLowerCase() === "true" || v === "1" || v.toLowerCase() === "sim";
  if (typeof v === "number") return v === 1;
  return false;
}

export function mapStatusVacina(s: unknown): string {
  if (s === null || s === undefined || s === "") return "Aplicada";
  if (typeof s === "number") return s === 1 ? "Aprazada" : "Aplicada";
  if (typeof s === "string") {
    const t = s.trim();
    if (t === "0") return "Aplicada";
    if (t === "1") return "Aprazada";
    return t;
  }
  return String(s);
}
