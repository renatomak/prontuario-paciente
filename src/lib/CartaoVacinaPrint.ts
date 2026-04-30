import type { Paciente, VacinaResumo } from "@/domain/models";

const documentoPadrao = {
  titulo: "CARTÃO DE VACINAÇÃO",
  prefeitura: "Prefeitura Municipal de Goiânia - GO",
  sistema: "SUS - SISTEMA ÚNICO DE SAÚDE",
  orgao: "Secretaria Municipal de Saúde de Goiânia - GO",
  enderecoUnidade: "Industrial - Setor Leste Vila Nova - CEP 74635-040",
  cidadeUnidade: "GOIANIA - GO",
  telefoneUnidade: "(62) 3524-1824",
};

function escapeHtml(value?: string | number | null): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDateBR(dateStr?: string | null): string {
  if (!dateStr) return "";
  if (/^\d{2}\/\d{2}\/\d{4}/.test(dateStr)) return dateStr.slice(0, 10);
  const m = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[3]}/${m[2]}/${m[1]}`;
  const d = new Date(dateStr);
  return Number.isNaN(d.getTime()) ? dateStr : d.toLocaleDateString("pt-BR");
}

function formatCpf(cpf?: string | null): string {
  if (!cpf) return "—";
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return cpf;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function formatSexo(s?: string | null): string {
  if (!s) return "—";
  const v = s.trim().toUpperCase();
  if (v === "M") return "Masculino";
  if (v === "F") return "Feminino";
  return s;
}

function formatEnderecoLogradouro(p: Paciente): string {
  const e = p.endereco;
  if (!e) return "—";
  return [e.tipoLogradouro, e.logradouro].filter(Boolean).join(" ") || "—";
}

function nomeArquivo(p: Paciente): string {
  const cpfDigits = (p.cpf || "").replace(/\D/g, "");
  const nomeSan = (p.nome || "PACIENTE")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "_")
    .toUpperCase();
  return `CARTAO_VACINACAO_${cpfDigits || p.id}_${nomeSan}`;
}

function renderHeader(logoBase64?: string): string {
  return `
    <header class="print-header">
      <div>${logoBase64 ? `<img class="logo" src="${logoBase64}" alt="Prefeitura de Goiânia" />` : ""}</div>
      <div class="header-text">
        <div class="prefeitura">${escapeHtml(documentoPadrao.prefeitura)}</div>
        <div class="sistema">${escapeHtml(documentoPadrao.sistema)}</div>
        <div class="orgao">${escapeHtml(documentoPadrao.orgao)}</div>
        <h1>${escapeHtml(documentoPadrao.titulo)}</h1>
      </div>
      <div></div>
    </header>
  `;
}

function renderFooter(): string {
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

function renderField(label: string, value?: string | number | null): string {
  const v = value === null || value === undefined || value === "" ? "—" : value;
  return `
    <div class="card-field">
      <span class="card-label">${escapeHtml(label)}:</span>
      <span class="card-value">${escapeHtml(v)}</span>
    </div>
  `;
}

function renderPaciente(p: Paciente): string {
  const e = p.endereco;
  return `
    <section class="paciente-box">
      <div class="paciente-title">Paciente: ${escapeHtml(p.nome)}</div>
      <div class="grid-2">
        ${renderField("Cartão SUS", p.cartaoSus ?? p.cd_usu_cadsus ?? null)}
        ${renderField("CPF", formatCpf(p.cpf))}
      </div>
      ${renderField("Nome", p.nome)}
      ${renderField("Nome Social", p.nomeSocial)}
      ${renderField("Nome da Mãe", p.nomeMae)}
      <div class="grid-3">
        ${renderField("País de Nascimento", p.paisNascimento)}
        ${renderField("UF de Nascimento", p.ufNascimento)}
        ${renderField("Município de Nascimento", p.municipioNascimento)}
      </div>
      <div class="grid-3">
        ${renderField("Nascimento", formatDateBR(p.dataNascimento))}
        ${renderField("Idade", p.idade)}
        ${renderField("Sexo", formatSexo(p.sexo))}
      </div>
      <div class="grid-2">
        ${renderField("Raça", p.raca)}
        ${renderField("Etnia", p.etnia)}
      </div>
      <div class="endereco-divider"></div>
      <div class="grid-3">
        ${renderField("Endereço", formatEnderecoLogradouro(p))}
        ${renderField("Número", e?.numero)}
        ${renderField("Complemento", e?.complemento)}
      </div>
      <div class="grid-3">
        ${renderField("Bairro", e?.bairro)}
        ${renderField("Município", e?.cidade)}
        ${renderField("UF", e?.uf)}
      </div>
      <div class="grid-2">
        ${renderField("CEP", e?.cep)}
        ${renderField("País", p.paisEndereco)}
      </div>
      <div class="grid-3">
        ${renderField("Telefone", p.telefone)}
        ${renderField("Tel. de contato", p.telefoneContato)}
        ${renderField("E-mail", p.email)}
      </div>
    </section>
  `;
}

function renderTabelaVacinas(vacinas: VacinaResumo[]): string {
  if (!vacinas.length) {
    return `<div class="vazio">Nenhuma vacina registrada para este paciente.</div>`;
  }
  const rows = vacinas
    .map(
      (v) => `
      <tr>
        <td class="data">${escapeHtml(formatDateBR(v.dataAplicacao))}</td>
        <td>${escapeHtml(v.nomeVacina ?? "--")}</td>
        <td class="dose">${escapeHtml(v.dose ?? "--")}</td>
        <td>${escapeHtml(v.estrategia ?? "--")}</td>
        <td>${escapeHtml(v.laboratorio ?? "--")}</td>
        <td>${escapeHtml(v.estabelecimento ?? "--")}</td>
        <td>${escapeHtml(v.profissional ?? "--")}</td>
        <td>${escapeHtml(v.status ?? "--")}</td>
      </tr>
    `,
    )
    .join("");

  return `
    <table class="vacinas-table">
      <thead>
        <tr>
          <th>Aplicação</th>
          <th>Imunobiológico</th>
          <th>Dose</th>
          <th>Estratégia</th>
          <th>Laboratório</th>
          <th>Estab. de Saúde</th>
          <th>Profissional</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function renderHtml(paciente: Paciente, vacinas: VacinaResumo[], logoBase64?: string): string {
  void paciente;
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8" />
<title>Cartão de Vacinação</title>
<style>
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; background: #f3f4f6; color: #202020; font-family: Arial, Helvetica, sans-serif; }
  #cartao-vacinacao { max-width: 210mm; margin: 0 auto; background: #fff; font-size: 11px; line-height: 1.35; }

  /* Shell de tabela para repetir cabeçalho/rodapé em cada página impressa */
  .page-shell { width: 100%; border-collapse: collapse; }
  .page-shell thead { display: table-header-group; }
  .page-shell tfoot { display: table-footer-group; }
  .page-shell td { padding: 0; vertical-align: top; }
  .page-shell td.content-cell { padding: 4mm 14mm 6mm 14mm; }
  .page-shell thead td { padding: 8mm 14mm 0 14mm; }
  .page-shell tfoot td { padding: 0 14mm 8mm 14mm; }

  /* Header (igual ao prontuário) */
  .print-header {
    display: grid;
    grid-template-columns: 34mm 1fr 34mm;
    align-items: start;
    gap: 8px;
    border-bottom: 1px solid #b8b8b8;
    padding-bottom: 8px;
    margin-bottom: 14px;
  }
  .logo { width: 54mm; max-height: 28mm; object-fit: contain; display: block; margin: 0 auto; }
  .header-text { display: flex; flex-direction: column; align-items: center; gap: 2px; text-align: center; }
  .print-header h1 { margin: 4px 0 0; font-size: 14px; font-weight: 700; }
  .print-header .prefeitura { font-size: 14px; font-weight: 700; }
  .print-header .sistema { font-size: 12px; }
  .print-header .orgao { font-size: 10px; }

  /* Footer (igual ao prontuário) */
  .print-footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    border-top: 1px solid #b8b8b8;
    margin-top: 14px;
    padding-top: 6px;
    color: #666666;
    font-size: 9px;
  }
  .print-timestamp { color: #b8b8b8; font-size: 8px; font-style: italic; margin-top: 2px; }

  /* Paciente */
  .paciente-box { border: 1px solid #d1d5db; border-radius: 4px; padding: 10px 12px; display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
  .paciente-title { font-size: 13px; font-weight: 700; color: #0f3a8a; padding-bottom: 4px; border-bottom: 1px dashed #e5e7eb; margin-bottom: 4px; }

  .card-field { display: flex; flex-wrap: wrap; gap: 0 6px; font-size: 11px; line-height: 1.4; min-width: 0; }
  .card-label { font-weight: 700; color: #374151; }
  .card-value { color: #111; overflow-wrap: anywhere; word-break: break-word; }

  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 16px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 4px 16px; }
  .endereco-divider { height: 1px; background: #e5e7eb; margin: 4px 0; }

  /* Tabela de vacinas */
  .vacinas-table { width: 100%; border-collapse: collapse; font-size: 10px; table-layout: auto; }
  .vacinas-table thead th { background: #0f3a8a; color: #fff; text-align: left; padding: 6px 6px; font-weight: 700; border: 1px solid #0f3a8a; }
  .vacinas-table tbody td { padding: 5px 6px; border: 1px solid #d1d5db; vertical-align: top; overflow-wrap: anywhere; word-break: break-word; }
  .vacinas-table tbody tr:nth-child(even) td { background: #f9fafb; }
  .vacinas-table td.data { white-space: nowrap; }
  .vacinas-table td.dose { white-space: nowrap; }
  .vacinas-table td.muted { color: #9ca3af; text-align: center; font-style: italic; }

  .vazio { text-align: center; padding: 24px 12px; color: #6b7280; font-size: 12px; border: 1px dashed #d1d5db; border-radius: 4px; }

  @media print {
    @page {
      size: A4 portrait;
      margin: 14mm 14mm 20mm;
      @top-left { content: ""; }
      @top-center { content: ""; }
      @top-right { content: ""; }
      @bottom-left { content: ""; }
      @bottom-center {
        content: "Página " counter(page) " de " counter(pages);
        font-family: Arial, Helvetica, sans-serif;
        font-size: 8pt;
        color: #b8b8b8;
      }
      @bottom-right { content: ""; }
    }
    html, body { background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    #cartao-vacinacao { max-width: none; box-shadow: none; }
    .page-shell td.content-cell, .page-shell thead td, .page-shell tfoot td { padding-left: 0; padding-right: 0; }
    .vacinas-table thead { display: table-header-group; }
    .vacinas-table tbody tr { page-break-inside: avoid; }
  }
</style>
</head>
<body>
  <div id="cartao-vacinacao">
    <table class="page-shell">
      <thead>
        <tr><td>${renderHeader(logoBase64)}</td></tr>
      </thead>
      <tfoot>
        <tr><td>${renderFooter()}</td></tr>
      </tfoot>
      <tbody>
        <tr>
          <td class="content-cell">
            ${renderPaciente(paciente)}
            ${renderTabelaVacinas(vacinas)}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <script>
    window.addEventListener('load', function() {
      setTimeout(function() {
        window.focus();
        window.print();
      }, 250);
    });
  </script>
</body>
</html>`;
}

export function imprimirCartaoVacinacao(
  paciente: Paciente,
  vacinas: VacinaResumo[],
  logoBase64?: string,
): void {
  const printWindow = window.open("", "_blank", "width=1024,height=768");
  if (!printWindow) {
    throw new Error("Não foi possível abrir a janela de impressão. Verifique o bloqueador de pop-ups.");
  }
  printWindow.document.open();
  printWindow.document.write(renderHtml(paciente, vacinas, logoBase64));
  printWindow.document.close();
}
