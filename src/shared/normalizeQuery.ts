/**
 * Normaliza uma string de busca de paciente.
 * - Remove caracteres não alfanuméricos
 * - Converte para uppercase
 */
export function normalizeQuery(input: string): string {
  return (input || "").replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
}

/** Indica se a string normalizada é um CPF (11 dígitos). */
export function isCpfQuery(input: string): boolean {
  const onlyDigits = (input || "").replace(/\D/g, "");
  return /^\d{11}$/.test(onlyDigits);
}
