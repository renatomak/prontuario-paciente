import { escapeHtml } from "@/shared/formatters";

export const documentoPadrao = {
  prefeitura: "Prefeitura Municipal de Goiania - GO",
  sistema: "SUS - SISTEMA UNICO DE SAUDE",
  orgao: "Secretaria Municipal de Saude de Goiania - GO",
  enderecoUnidade: "Industrial - Setor Leste Vila Nova - CEP 74635-040",
  cidadeUnidade: "GOIANIA - GO",
  telefoneUnidade: "(62) 3524-1824",
};

export function renderPrintHeader(titulo: string, logoBase64?: string): string {
  return `
    <header class="print-header">
      <div>${logoBase64 ? `<img class="logo" src="${logoBase64}" alt="Prefeitura de Goiania" />` : ""}</div>
      <div class="header-text">
        <div class="prefeitura">${escapeHtml(documentoPadrao.prefeitura)}</div>
        <div class="sistema">${escapeHtml(documentoPadrao.sistema)}</div>
        <div class="orgao">${escapeHtml(documentoPadrao.orgao)}</div>
        <h1>${escapeHtml(titulo)}</h1>
      </div>
      <div></div>
    </header>
  `;
}

export function renderPrintFooter(): string {
  const ts = new Date().toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  return `
    <footer class="print-footer">
      <div>${escapeHtml(documentoPadrao.enderecoUnidade)}</div>
      <strong>${escapeHtml(documentoPadrao.cidadeUnidade)} | ${escapeHtml(documentoPadrao.telefoneUnidade)}</strong>
      <div class="print-timestamp">Emitido em ${escapeHtml(ts)}</div>
    </footer>
  `;
}

export function renderField(label: string, value?: string | number | null): string {
  const v = value === null || value === undefined || value === "" ? "\u2014" : value;
  return `
    <div class="card-field">
      <span class="card-label">${escapeHtml(label)}:</span>
      <span class="card-value">${escapeHtml(v)}</span>
    </div>
  `;
}

export function renderCampo(label: string, value?: string | number | null, className = ""): string {
  return `
    <div class="pdf-field ${className}">
      <span class="pdf-label">${escapeHtml(label)}:</span>
      <span class="pdf-value">${escapeHtml(value || "\u2014")}</span>
    </div>
  `;
}

export function openPrintWindow(html: string): void {
  const printWindow = window.open("", "_blank", "width=1024,height=768");
  if (!printWindow) throw new Error("Nao foi possivel abrir a janela de impressao. Verifique o bloqueador de pop-ups.");
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
