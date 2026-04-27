import logoUrl from "@/assets/logo-goiania.png";

let cached: string | null = null;

export async function getLogoBase64(): Promise<string> {
  if (cached) return cached;
  const res = await fetch(logoUrl);
  const blob = await res.blob();
  cached = await new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
  return cached;
}
