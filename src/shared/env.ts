// Lê a URL base da API Java a partir das variáveis VITE_*.
// Suporta override em runtime via window.__API_URL__ (útil quando o .env
// foi sobrescrito acidentalmente — ex.: definição duplicada).
declare global {
  interface Window {
    __API_URL__?: string;
  }
}

export function getApiBaseUrl(): string {
  // 1) Override em runtime (window.__API_URL__) — maior precedência.
  if (typeof window !== "undefined" && typeof window.__API_URL__ === "string" && window.__API_URL__) {
    return window.__API_URL__.replace(/\/+$/, "");
  }

  // 2) Variável de ambiente padrão.
  const url = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
  if (!url) {
    throw new Error(
      "VITE_API_URL não definida. Configure a URL da API Java no .env ou window.__API_URL__.",
    );
  }

  // Sanity-check: localhost sem porta provavelmente não é o backend Java (que roda em 8083).
  // Avisamos no console para facilitar diagnóstico.
  if (/^https?:\/\/localhost\/?$/i.test(url)) {
    console.warn(
      "[env] VITE_API_URL=%s parece incompleto (sem porta). Backend Java costuma rodar em :8083. " +
        "Defina window.__API_URL__='http://localhost:8083' no console para testar.",
      url,
    );
  }

  return url.replace(/\/+$/, "");
}
