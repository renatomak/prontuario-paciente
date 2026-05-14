import type { PacienteResponse } from "@/features/paciente/port/schemas";
import type { VacinaResumoResponse } from "@/features/vacina";
import { escapeHtml, formatSexo, sanitizeNomeArquivo } from "@/shared/formatters";
import { renderPrintHeader, renderPrintFooter, renderField, openPrintWindow } from "@/shared/printUtils";

function formatEnderecoLogradouro(p: PacienteResponse): string {
  const e = p.endereco;
  if (!e) return "\u2014";
  return [e.tipoLogradouro, e.logradouro].filter(Boolean).join(" ") || "\u2014";
}

export function nomeArquivoCartaoVacinacao(p: PacienteResponse): string {
  return sanitizeNomeArquivo("CARTAO_VACINACAO", p.nome, p.cpf, p.id);
}

function renderPaciente(p: PacienteResponse): string {
  const e = p.endereco;
  return `
    <section class="paciente-box">
      <div class="paciente-title">Paciente: ${escapeHtml(p.nome)}</div>
      <div class="grid-2">
        ${renderField("Cartao SUS", p.cartaoSus ?? p.cdUsuCadsus ?? null)}
        ${renderField("CPF", p.cpf)}
      </div>
      ${renderField("Nome", p.nome)}
      ${renderField("Nome Social", p.nomeSocial)}
      ${renderField("Nome da Mae", p.nomeMae)}
      <div class="grid-3">
        ${renderField("Pais de Nascimento", p.paisNascimento)}
        ${renderField("UF de Nascimento", p.ufNascimento)}
        ${renderField("Municipio de Nascimento", p.municipioNascimento)}
      </div>
      <div class="grid-3">
        ${renderField("Nascimento", p.dataNascimento)}
        ${renderField("Idade", p.idade)}
        ${renderField("Sexo", formatSexo(p.sexo))}
      </div>
      <div class="grid-2">
        ${renderField("Raca", p.raca)}
        ${renderField("Etnia", p.etnia)}
      </div>
      <div class="endereco-divider"></div>
      <div class="grid-3">
        ${renderField("Endereco", formatEnderecoLogradouro(p))}
        ${renderField("Numero", e?.numero)}
        ${renderField("Complemento", e?.complemento)}
      </div>
      <div class="grid-3">
        ${renderField("Bairro", e?.bairro)}
        ${renderField("Municipio", e?.cidade)}
        ${renderField("UF", e?.uf)}
      </div>
      <div class="grid-2">
        ${renderField("CEP", e?.cep)}
        ${renderField("Pais", p.paisEndereco)}
      </div>
      <div class="grid-3">
        ${renderField("Telefone", p.telefone)}
        ${renderField("Tel. de contato", p.telefoneContato)}
        ${renderField("E-mail", p.email)}
      </div>
    </section>
  `;
}

function renderTabelaVacinas(vacinas: VacinaResumoResponse[]): string {
  if (!vacinas.length) {
    return `<div class="vazio">Nenhuma vacina registrada para este paciente.</div>`;
  }
  const rows = vacinas
    .map(
      (v) => `
      <tr>
        <td class="data">${escapeHtml(v.dataAplicacao)}</td>
        <td>${escapeHtml(v.estrategia ?? "--")}</td>
        <td>${escapeHtml(v.nomeVacina ?? "--")}</td>
        <td class="dose">${escapeHtml(v.dose ?? "--")}</td>
        <td>${escapeHtml(v.laboratorio ?? "NI")}</td>
        <td>${escapeHtml(v.lote ?? "--")}</td>
        <td>${escapeHtml(v.estabelecimento ?? "--")}</td>
      </tr>
    `,
    )
    .join("");

  return `
    <table class="vacinas-table">
      <thead>
        <tr>
          <th class="col-aplic">Aplicacao</th>
          <th class="col-estrat">Estrategia</th>
          <th class="col-imuno">Imunobiologico</th>
          <th class="col-dose">Dose</th>
          <th class="col-lab">Laboratorio</th>
          <th class="col-lote">Lote</th>
          <th class="col-estab">Estab. de Saude</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function renderHtml(paciente: PacienteResponse, vacinas: VacinaResumoResponse[], logoBase64?: string): string {
  const tituloArquivo = nomeArquivoCartaoVacinacao(paciente);

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8" />
<title>${escapeHtml(tituloArquivo)}</title>
<style>
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; background: #f3f4f6; color: #202020; font-family: Arial, Helvetica, sans-serif; }
  #cartao-vacinacao { max-width: 297mm; margin: 0 auto; background: #fff; font-size: 11px; line-height: 1.35; }
  .page-shell { width: 100%; border-collapse: collapse; }
  .page-shell thead { display: table-header-group; }
  .page-shell tfoot { display: table-footer-group; }
  .page-shell td { padding: 0; vertical-align: top; }
  .page-shell td.content-cell { padding: 4mm 14mm 6mm 14mm; }
  .page-shell thead td { padding: 8mm 14mm 0 14mm; }
  .page-shell tfoot td { padding: 0 14mm 8mm 14mm; }
  .print-header { display: grid; grid-template-columns: 34mm 1fr 34mm; align-items: start; gap: 8px; border-bottom: 1px solid #b8b8b8; padding-bottom: 8px; margin-bottom: 14px; }
  .logo { width: 54mm; max-height: 28mm; object-fit: contain; display: block; margin: 0 auto; }
  .header-text { display: flex; flex-direction: column; align-items: center; gap: 2px; text-align: center; }
  .print-header h1 { margin: 4px 0 0; font-size: 14px; font-weight: 700; }
  .print-header .prefeitura { font-size: 14px; font-weight: 700; }
  .print-header .sistema { font-size: 12px; }
  .print-header .orgao { font-size: 10px; }
  .print-footer { display: flex; flex-direction: column; align-items: center; gap: 3px; border-top: 1px solid #b8b8b8; margin-top: 14px; padding-top: 6px; color: #666666; font-size: 9px; }
  .print-timestamp { color: #b8b8b8; font-size: 8px; font-style: italic; margin-top: 2px; }
  .paciente-box { border: 1px solid #d1d5db; border-radius: 4px; padding: 10px 12px; display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
  .paciente-title { font-size: 13px; font-weight: 700; color: #0f3a8a; padding-bottom: 4px; border-bottom: 1px dashed #e5e7eb; margin-bottom: 4px; }
  .card-field { display: flex; flex-wrap: wrap; gap: 0 6px; font-size: 11px; line-height: 1.4; min-width: 0; }
  .card-label { font-weight: 700; color: #374151; }
  .card-value { color: #111; overflow-wrap: anywhere; word-break: break-word; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 16px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 4px 16px; }
  .endereco-divider { height: 1px; background: #e5e7eb; margin: 4px 0; }
  .vacinas-table { width: 100%; border-collapse: collapse; font-size: 10px; table-layout: fixed; }
  .vacinas-table thead th { background: #0f3a8a; color: #ffffff; text-align: center; padding: 6px 6px; font-weight: 700; border: 1px solid #0f3a8a; }
  .vacinas-table tbody td { padding: 6px 8px; border: 1px solid #4b5563; vertical-align: middle; overflow-wrap: anywhere; word-break: break-word; }
  .vacinas-table tbody tr:nth-child(even) td { background: #ffffff; }
  .vacinas-table td.data { white-space: nowrap; text-align: center; }
  .vacinas-table td.dose { white-space: nowrap; text-align: center; }
  .vacinas-table .col-aplic { width: 9%; }
  .vacinas-table .col-estrat { width: 9%; }
  .vacinas-table .col-imuno { width: 22%; }
  .vacinas-table .col-dose { width: 8%; }
  .vacinas-table .col-lab { width: 14%; }
  .vacinas-table .col-lote { width: 12%; }
  .vacinas-table .col-estab { width: 26%; }
  .vazio { text-align: center; padding: 24px 12px; color: #6b7280; font-size: 12px; border: 1px dashed #d1d5db; border-radius: 4px; }
  @media print {
    @page { size: A4 landscape; margin: 12mm 12mm 18mm; @bottom-center { content: "Pagina " counter(page) " de " counter(pages); font-family: Arial, Helvetica, sans-serif; font-size: 8pt; color: #b8b8b8; } }
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
        <tr><td>${renderPrintHeader("CARTAO DE VACINACAO", logoBase64)}</td></tr>
      </thead>
      <tfoot>
        <tr><td>${renderPrintFooter()}</td></tr>
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
    window.addEventListener('load', function() { setTimeout(function() { window.focus(); window.print(); }, 250); });
  </script>
</body>
</html>`;
}

export function imprimirCartaoVacinacao(
  paciente: PacienteResponse,
  vacinas: VacinaResumoResponse[],
  logoBase64?: string,
): void {
  openPrintWindow(renderHtml(paciente, vacinas, logoBase64));
}
