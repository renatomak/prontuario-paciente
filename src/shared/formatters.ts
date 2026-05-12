export function escapeHtml(value?: string | number | null): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function formatCpf(cpf?: string | null, fallback = ""): string {
  if (!cpf) return fallback;
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return cpf;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

export function formatCpfMask(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

export function formatSexo(s?: string | null): string {
  if (!s) return "\u2014";
  const v = s.trim().toUpperCase();
  if (v === "M") return "Masculino";
  if (v === "F") return "Feminino";
  return s;
}

export interface EnderecoLike {
  tipoLogradouro?: string | null;
  logradouro?: string | null;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  uf?: string | null;
}

export function formatEndereco(endereco?: EnderecoLike | null): string {
  if (!endereco) return "";
  return [
    endereco.tipoLogradouro,
    endereco.logradouro,
    endereco.numero !== "00" ? endereco.numero : null,
    endereco.complemento,
    endereco.bairro,
    endereco.cidade && `${endereco.cidade} - ${endereco.uf ?? ""}`,
  ]
    .filter(Boolean)
    .join(", ");
}

export function sanitizeNomeArquivo(prefix: string, nome?: string | null, cpf?: string | null, id?: number | string | null): string {
  const cpfDigits = (cpf || "").replace(/\D/g, "");
  const nomeSan = (nome || "PACIENTE")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "_")
    .toUpperCase();
  return `${prefix}_${cpfDigits || id || 0}_${nomeSan}`;
}
