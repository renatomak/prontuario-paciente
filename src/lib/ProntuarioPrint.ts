import type {
  ProntuarioAtendimento,
  ProntuarioResponse,
} from "@/features/prontuario/domain/schemas";
import { escapeHtml, formatEndereco, sanitizeNomeArquivo } from "@/shared/formatters";
import { renderPrintHeader, renderPrintFooter, renderCampo, openPrintWindow } from "@/shared/printUtils";
import { blocosConteudo } from "@/shared/prontuarioUtils";
import { limparHtml } from "@/lib/limparHtml";

function normalizarTexto(texto?: string | null): string {
  return limparHtml(texto)
    .replace(/\S{70,}/g, (token) => token.match(/.{1,45}/g)?.join(" ") ?? token)
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function renderPaciente(data: ProntuarioResponse): string {
  const { paciente } = data;
  return `
    <section class="patient-section pdf-section">
      <h2>Dados do Paciente</h2>
      <div class="patient-grid">
        ${renderCampo("Nome", `( ${paciente.id} ) ${paciente.nome || ""}`, "patient-name")}
        ${renderCampo("Sexo", paciente.sexo)}
        ${renderCampo("Nome da Mae", paciente.nomeMae)}
        ${renderCampo("Dt. Nascimento", paciente.dataNascimento)}
        ${renderCampo("Endereco", formatEndereco(paciente.endereco), "patient-address")}
        ${renderCampo("Telefone", paciente.telefone)}
        ${renderCampo("CPF", paciente.cpf)}
      </div>
    </section>
  `;
}

function renderAtendimentoHeader(a: ProntuarioAtendimento): string {
  const conselho = a.profissional?.tipoConselho && a.profissional.registro
    ? ` (${a.profissional.tipoConselho}: ${a.profissional.registro})`
    : "";

  let dataRegistro = a.dataChegada;
  if (a.possuiAih && a.aihDetalhes?.dataCadastro) {
    dataRegistro = a.aihDetalhes.dataCadastro;
  } else if (a.registros && a.registros.length > 0 && a.registros[0].data) {
    dataRegistro = a.registros[0].data;
  }

  return `
    <div class="atendimento-header">
      <div class="atendimento-main">
        <h3>${escapeHtml(a.unidade?.nome || "Unidade nao informada")}</h3>
        ${a.tipoAtendimento ? renderCampo("Tipo de Atendimento", a.tipoAtendimento) : ""}
        ${a.profissional?.nome ? renderCampo("Profissional", `${a.profissional.nome}${conselho}`) : ""}
      </div>
      <div class="atendimento-meta">
        ${a.possuiAih ? `<span class="aih-badge">AIH SOLICITADA</span>` : ""}
        ${renderCampo("Data Registro", dataRegistro)}
        ${a.numeroAtendimento ? renderCampo("Nr", a.numeroAtendimento) : ""}
        ${a.classificacaoRisco ? renderCampo("Risco", a.classificacaoRisco) : ""}
      </div>
    </div>
  `;
}

function renderAtendimento(a: ProntuarioAtendimento): string {
  const registros = a.registros || [];
  const aih = a.possuiAih && a.aihDetalhes
    ? `
      <div class="aih-section pdf-section">
        <h4>DETALHES DA SOLICITACAO DE INTERNACAO</h4>
        <div class="content-block">
          <span class="content-label">Data de Cadastro:</span>
          <div class="content-value">${escapeHtml(a.aihDetalhes.dataCadastro || "Nao informado")}</div>
        </div>
        <div class="content-block">
          <span class="content-label">Diagnostico Inicial:</span>
          <div class="content-value long-text">${escapeHtml(normalizarTexto(a.aihDetalhes.diagnosticoInicial) || "Nao informado")}</div>
        </div>
        <div class="content-block">
          <span class="content-label">Sinais e Sintomas:</span>
          <div class="content-value long-text">${escapeHtml(normalizarTexto(a.aihDetalhes.principaisSinais) || "Nao informado")}</div>
        </div>
        <div class="content-block">
          <span class="content-label">Condicoes que Justificam a Internacao:</span>
          <div class="content-value long-text">${escapeHtml(normalizarTexto(a.aihDetalhes.condicoesInternacao) || "Nao informado")}</div>
        </div>
        <div class="content-block">
          <span class="content-label">Principais Resultados de Provas Diagnosticas:</span>
          <div class="content-value long-text">${escapeHtml(normalizarTexto(a.aihDetalhes.principaisResultados) || "Nao informado")}</div>
        </div>
      </div>
    `
    : "";

  const registrosHtml = registros.length > 0
    ? registros.map((registro) => {
        const blocos = blocosConteudo(registro.conteudo);
        return `
          <section class="registro-section pdf-section">
            <div class="registro-header">
              <strong>Tipo: ${escapeHtml(registro.tipo || "\u2014")}</strong>
              <span>${escapeHtml(registro.data)}</span>
            </div>
            ${blocos.length > 0
              ? blocos.map((b) => `
                <div class="content-block ${b.longText ? "evolucao-block" : ""}">
                  <span class="content-label">${escapeHtml(b.label)}:</span>
                  <div class="content-value ${b.longText ? "long-text" : ""}">${escapeHtml(b.texto)}</div>
                </div>
              `).join("")
              : `<p class="empty-text">(Sem conteudo)</p>`}
          </section>
        `;
      }).join("")
    : (!a.possuiAih ? `<p class="empty-text sem-registro">(Sem registros clinicos)</p>` : "");

  return `
    <article class="atendimento-section pdf-section">
      ${renderAtendimentoHeader(a)}
      ${aih}
      ${registrosHtml}
    </article>
  `;
}

function renderHtml(data: ProntuarioResponse, logoBase64?: string): string {
  const atendimentos = [...(data.atendimentos || [])].sort(
    (a, b) => new Date(b.dataChegada || "").getTime() - new Date(a.dataChegada || "").getTime(),
  );

  return `<!doctype html>
    <html lang="pt-BR">
      <head>
        <meta charset="utf-8" />
        <title>Prontuario de Atendimentos</title>
        <style>
          @page { size: A4 portrait; margin: 14mm 14mm 20mm; @bottom-center { content: "Pagina " counter(page) " de " counter(pages); font-family: Arial, Helvetica, sans-serif; font-size: 8pt; color: #b8b8b8; } }
          @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
          #prontuario-impressao, #prontuario-impressao * { box-sizing: border-box; }
          body { margin: 0; background: #ffffff; color: #202020; font-family: Arial, Helvetica, sans-serif; }
          #prontuario-impressao { width: 100%; font-size: 11px; line-height: 1.35; }
          #prontuario-impressao .print-shell { width: 100%; border-collapse: collapse; }
          #prontuario-impressao .print-shell thead { display: table-header-group; }
          #prontuario-impressao .print-shell tfoot { display: table-footer-group; }
          #prontuario-impressao .print-shell td { padding: 0; vertical-align: top; }
          #prontuario-impressao .print-header { display: grid; grid-template-columns: 34mm 1fr 34mm; align-items: start; gap: 8px; border-bottom: 1px solid #b8b8b8; padding-bottom: 8px; margin-bottom: 14px; }
          #prontuario-impressao .logo { width: 54mm; max-height: 28mm; object-fit: contain; display: block; margin: 0 auto; }
          #prontuario-impressao .header-text { display: flex; flex-direction: column; align-items: center; gap: 2px; text-align: center; }
          #prontuario-impressao h1, #prontuario-impressao h2, #prontuario-impressao h3, #prontuario-impressao h4, #prontuario-impressao p { margin: 0; }
          #prontuario-impressao h1 { margin-top: 4px; font-size: 14px; font-weight: 700; }
          #prontuario-impressao .prefeitura { font-size: 14px; font-weight: 700; }
          #prontuario-impressao .sistema { font-size: 12px; }
          #prontuario-impressao .orgao { font-size: 10px; }
          #prontuario-impressao .print-body { display: flex; flex-direction: column; gap: 12px; }
          #prontuario-impressao .pdf-section { break-inside: auto; page-break-inside: auto; }
          #prontuario-impressao .patient-section { display: flex; flex-direction: column; gap: 8px; border: 1px solid #b8b8b8; border-radius: 4px; background: #f5f7fa; padding: 10px; }
          #prontuario-impressao .patient-section h2 { font-size: 12px; font-weight: 700; }
          #prontuario-impressao .patient-grid { display: grid; grid-template-columns: 1fr 0.55fr; column-gap: 16px; row-gap: 6px; }
          #prontuario-impressao .patient-address, #prontuario-impressao .patient-name { grid-column: span 1; }
          #prontuario-impressao .pdf-field { display: flex; flex-direction: row; align-items: baseline; gap: 0 8px; min-width: 0; flex-wrap: nowrap; }
          #prontuario-impressao .pdf-label { flex: 0 0 auto; font-weight: 700; color: #4f4f4f; }
          #prontuario-impressao .pdf-value { flex: 1 1 70px; min-width: 0; overflow-wrap: break-word; word-break: break-word; }
          #prontuario-impressao .atendimento-section { display: flex; flex-direction: column; gap: 12px; }
          #prontuario-impressao .atendimento-header { display: grid; grid-template-columns: minmax(0, 1fr) 54mm; gap: 14px; border: 1px solid #c4c9cf; border-radius: 4px; background: #dfe7f2; padding: 10px; break-inside: avoid; page-break-inside: avoid; break-after: avoid; page-break-after: avoid; }
          #prontuario-impressao .atendimento-main, #prontuario-impressao .atendimento-meta { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
          #prontuario-impressao .atendimento-main h3 { font-size: 13px; font-weight: 700; overflow-wrap: break-word; word-break: break-word; }
          #prontuario-impressao .atendimento-meta { text-align: right; align-items: flex-end; }
          #prontuario-impressao .atendimento-meta .pdf-field { justify-content: flex-end; }
          #prontuario-impressao .aih-badge { display: inline-block; background: #d1fae5; color: #065f46; border: 1px solid #6ee7b7; font-weight: 700; font-size: 10px; padding: 2px 8px; border-radius: 10px; letter-spacing: 0.3px; }
          #prontuario-impressao .aih-section, #prontuario-impressao .registro-section { display: flex; flex-direction: column; gap: 8px; padding: 0 4px 4px; }
          #prontuario-impressao .aih-section h4 { color: #1e40af; font-size: 10px; font-weight: 700; }
          #prontuario-impressao .registro-section { border-top: 1px solid #dedede; padding-top: 8px; }
          #prontuario-impressao .registro-header { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px; font-size: 12px; }
          #prontuario-impressao .content-block { display: flex; flex-direction: column; gap: 4px; min-width: 0; padding-bottom: 4px; }
          #prontuario-impressao .content-label { font-weight: 700; color: #202020; }
          #prontuario-impressao .content-value { min-width: 0; overflow-wrap: anywhere; word-break: break-word; white-space: pre-wrap; }
          #prontuario-impressao .long-text { overflow-wrap: anywhere; word-break: break-word; white-space: pre-wrap; }
          #prontuario-impressao .evolucao-block { padding-bottom: 4px; }
          #prontuario-impressao .empty-text { color: #666666; font-style: italic; padding: 0 4px 4px; }
          #prontuario-impressao .sem-registro { display: block; }
          #prontuario-impressao .print-footer { display: flex; flex-direction: column; align-items: center; gap: 3px; border-top: 1px solid #b8b8b8; margin-top: 14px; padding-top: 6px; color: #666666; font-size: 9px; }
          #prontuario-impressao .print-timestamp { color: #b8b8b8; font-size: 8px; font-style: italic; margin-top: 2px; }
        </style>
      </head>
      <body>
        <main id="prontuario-impressao">
          <table class="print-shell">
            <thead>
              <tr><td>${renderPrintHeader("PRONTUARIO DE ATENDIMENTOS", logoBase64)}</td></tr>
            </thead>
            <tbody>
              <tr><td>
                <div class="print-body">
                  ${renderPaciente(data)}
                  ${atendimentos.length > 0 ? atendimentos.map(renderAtendimento).join("") : `<p class="empty-text">Nenhum atendimento registrado.</p>`}
                </div>
              </td></tr>
            </tbody>
            <tfoot>
              <tr><td>${renderPrintFooter()}</td></tr>
            </tfoot>
          </table>
        </main>
        <script>
          window.addEventListener('load', () => setTimeout(() => window.print(), 250));
        </script>
      </body>
    </html>`;
}

export function imprimirProntuario(data: ProntuarioResponse, logoBase64?: string): void {
  openPrintWindow(renderHtml(data, logoBase64));
}

export function obterNomeArquivoProntuario(data: ProntuarioResponse): string {
  return sanitizeNomeArquivo("PRONTUARIO", data.paciente.nome, data.paciente.cpf, data.paciente.cdUsuCadsus ?? data.paciente.id);
}
