// Função para limpar HTML e caracteres especiais do campo conteudo, baseada na lógica Java fornecida
export function limparHtml(texto?: string | null): string {
  if (!texto || !texto.trim()) return "";

  // 1. Preservar quebras de linha básicas
  let preparoTexto = texto
    .replace(/<br\s*\/?>/gi, " ___BR___ ")
    .replace(/<\/p>/gi, " ___BR___ ")
    .replace(/<\/div>/gi, " ___BR___ ");

  // 2. Extrair texto limpo de tags (sem jsoup, mas usando DOMParser se disponível, senão regex)
  // Como estamos em ambiente Node/React-pdf, usar regex simples para remover tags
  let textoLimpo = preparoTexto.replace(/<[^>]+>/g, "");

  // 3. Recuperar quebras e limpeza pesada
  textoLimpo = textoLimpo.replace(/___BR___/g, "\n");

  // 4. Regex para remover tudo que não for ASCII, Latin-1 ou \n
  // [^\x00-\x7F\xA0-\xFF\n]
  textoLimpo = textoLimpo.replace(/[^\x00-\x7F\xA0-\xFF\n]/g, "");

  // 5. Normalização de espaços residuais
  return textoLimpo
    .replace(/^[ \t]+/gm, "") // Remove espaços no início das linhas
    .replace(/[ \t]+$/gm, "") // Remove espaços no fim das linhas
    .replace(/[ ]{2,}/g, " ") // Espaços duplos para simples
    .trim();
}
