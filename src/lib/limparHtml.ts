// Função para limpar HTML e caracteres especiais do campo conteudo

// Mapa de entidades HTML nomeadas mais comuns (Latin-1 + símbolos frequentes)
const NAMED_ENTITIES: Record<string, string> = {
  nbsp: " ",
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  copy: "©",
  reg: "®",
  trade: "™",
  hellip: "…",
  mdash: "—",
  ndash: "–",
  lsquo: "‘",
  rsquo: "’",
  ldquo: "“",
  rdquo: "”",
  laquo: "«",
  raquo: "»",
  bull: "•",
  middot: "·",
  ordm: "º",
  ordf: "ª",
  deg: "°",
  micro: "µ",
  para: "¶",
  sect: "§",
  iexcl: "¡",
  iquest: "¿",
  cent: "¢",
  pound: "£",
  yen: "¥",
  euro: "€",
  // Vogais com acento - maiúsculas
  Aacute: "Á", Eacute: "É", Iacute: "Í", Oacute: "Ó", Uacute: "Ú",
  Agrave: "À", Egrave: "È", Igrave: "Ì", Ograve: "Ò", Ugrave: "Ù",
  Acirc: "Â", Ecirc: "Ê", Icirc: "Î", Ocirc: "Ô", Ucirc: "Û",
  Atilde: "Ã", Ntilde: "Ñ", Otilde: "Õ",
  Auml: "Ä", Euml: "Ë", Iuml: "Ï", Ouml: "Ö", Uuml: "Ü",
  Ccedil: "Ç",
  // Vogais com acento - minúsculas
  aacute: "á", eacute: "é", iacute: "í", oacute: "ó", uacute: "ú",
  agrave: "à", egrave: "è", igrave: "ì", ograve: "ò", ugrave: "ù",
  acirc: "â", ecirc: "ê", icirc: "î", ocirc: "ô", ucirc: "û",
  atilde: "ã", ntilde: "ñ", otilde: "õ",
  auml: "ä", euml: "ë", iuml: "ï", ouml: "ö", uuml: "ü",
  ccedil: "ç",
};

function decodeEntities(text: string): string {
  // Numéricas decimais &#123;
  let out = text.replace(/&#(\d+);/g, (_, n) => {
    try { return String.fromCodePoint(parseInt(n, 10)); } catch { return ""; }
  });
  // Numéricas hex &#xAB;
  out = out.replace(/&#x([0-9a-fA-F]+);/g, (_, n) => {
    try { return String.fromCodePoint(parseInt(n, 16)); } catch { return ""; }
  });
  // Nomeadas &name;
  out = out.replace(/&([a-zA-Z][a-zA-Z0-9]+);/g, (m, name) => {
    return Object.prototype.hasOwnProperty.call(NAMED_ENTITIES, name)
      ? NAMED_ENTITIES[name]
      : m;
  });
  return out;
}

export function limparHtml(texto?: string | null): string {
  if (!texto || !texto.trim()) return "";

  // 0. Normalizar quebras de linha (\r\n e \r isolados -> \n)
  let preparoTexto = texto.replace(/\r\n?/g, "\n");

  // 1. Preservar quebras de linha básicas das tags de bloco
  preparoTexto = preparoTexto
    .replace(/<br\s*\/?>/gi, " ___BR___ ")
    .replace(/<\/p>/gi, " ___BR___ ")
    .replace(/<\/div>/gi, " ___BR___ ")
    .replace(/<\/li>/gi, " ___BR___ ")
    .replace(/<\/tr>/gi, " ___BR___ ");

  // 2. Remover tags
  let textoLimpo = preparoTexto.replace(/<[^>]+>/g, "");

  // 3. Decodificar entidades HTML (nomeadas + numéricas)
  textoLimpo = decodeEntities(textoLimpo);

  // 4. Recuperar quebras
  textoLimpo = textoLimpo.replace(/___BR___/g, "\n");

  // 5. Remover caracteres de controle (exceto \n) que podem virar glifos no PDF
  // Inclui \x00-\x08, \x0B, \x0C, \x0E-\x1F, \x7F
  textoLimpo = textoLimpo.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  // 6. Normalização de espaços
  return textoLimpo
    .replace(/\u00a0/g, " ")
    .replace(/^[ \t]+/gm, "")
    .replace(/[ \t]+$/gm, "")
    .replace(/[ ]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
