
export function getApiBaseUrl(): string {
  const url = import.meta.env.VITE_API_URL;
  if (!url) {
    throw new Error("VITE_API_URL não definida. Configure a URL da API Java no .env.");
  }
  return url;
}
