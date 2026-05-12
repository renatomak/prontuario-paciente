declare global {
  interface Window {
    __PACIENTE_API_URL__?: string;
    __RAAS_API_URL__?: string;
  }
}

function getBaseUrl(
  windowVar: string | undefined,
  windowVarName: string,
  envVar: string | undefined,
  envName: string,
  defaultPort: number,
  apiName: string,
): string {
  if (typeof window !== "undefined" && typeof windowVar === "string" && windowVar) {
    return windowVar.replace(/\/+$/, "");
  }
  const url = envVar?.trim();
  if (!url) {
    throw new Error(
      `${envName} nao definida. Configure no .env ou defina window.${windowVarName}='http://localhost:${defaultPort}' no console.`,
    );
  }

  if (/^https?:\/\/localhost\/?$/i.test(url)) {
    console.warn(
      `[env] ${envName}=%s parece incompleto (sem porta). O backend ${apiName} geralmente roda em :${defaultPort}. ` +
        `Defina window.${windowVarName}='http://localhost:${defaultPort}' para testar.`,
      url,
    );
  }

  return url.replace(/\/+$/, "");
}

export function getPacienteApiBaseUrl(): string {
  return getBaseUrl(
    window.__PACIENTE_API_URL__,
    "__PACIENTE_API_URL__",
    import.meta.env.VITE_PACIENTE_API_URL as string | undefined,
    "VITE_PACIENTE_API_URL",
    8083,
    "Pacientes/Vacinas/Prontuarios",
  );
}

export function getRaasApiBaseUrl(): string {
  return getBaseUrl(
    window.__RAAS_API_URL__,
    "__RAAS_API_URL__",
    import.meta.env.VITE_RAAS_API_URL as string | undefined,
    "VITE_RAAS_API_URL",
    8081,
    "RAAS",
  );
}
