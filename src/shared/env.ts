declare global {
  interface Window {
    __API_URL__?: string;
    __RAAS_API_URL__?: string;
  }
}

// API principal (paciente, vacinas, prontuarios)
export function getApiBaseUrl(): string {
  if (typeof window !== "undefined" && typeof window.__API_URL__ === "string" && window.__API_URL__) {
    return window.__API_URL__.replace(/\/+$/, "");
  }

  const url = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
  if (!url) {
    throw new Error(
      "VITE_API_URL não definida. Configure a URL da API Java no .env ou window.__API_URL__."
    );
  }

  if (/^https?:\/\/localhost\/?$/i.test(url)) {
    console.warn(
      "[env] VITE_API_URL=%s parece incompleto (sem porta). Backend Java costuma rodar em :8083. " +
        "Defina window.__API_URL__='http://localhost:8083' no console para testar.",
      url
    );
  }

  return url.replace(/\/+$/, "");
}

// API do RAAS (porta 8081)
export function getRaasApiBaseUrl(): string {
  if (typeof window !== "undefined" && typeof window.__RAAS_API_URL__ === "string" && window.__RAAS_API_URL__) {
    return window.__RAAS_API_URL__.replace(/\/+$/, "");
  }

  const url = (import.meta.env.VITE_RAAS_API_URL as string | undefined)?.trim();
  if (!url) {
    throw new Error(
      "VITE_RAAS_API_URL não definida. Configure a URL da API RAAS no .env ou window.__RAAS_API_URL__."
    );
  }

  if (/^https?:\/\/localhost\/?$/i.test(url)) {
    console.warn(
      "[env] VITE_RAAS_API_URL=%s parece incompleto (sem porta). Backend RAAS costuma rodar em :8081. " +
        "Defina window.__RAAS_API_URL__='http://localhost:8081' no console para testar.",
      url
    );
  }

  return url.replace(/\/+$/, "");
}
