import type {
  ApiAtendimento,
  ApiEndereco,
  ApiProntuarioResponse,
  ApiRegistroConteudo,
} from "@/lib/prontuarioApi";
import { limparHtml } from "@/lib/limparHtml";

const documentoPadrao = {
  titulo: "PRONTUÁRIO DE ATENDIMENTOS",
  prefeitura: "Prefeitura Municipal de Goiânia - GO",
  sistema: "SUS - SISTEMA ÚNICO DE SAÚDE",
  orgao: "Secretaria Municipal de Saúde de Goiânia - GO",
  enderecoUnidade: "Industrial - Setor Leste Vila Nova - CEP 74635-040",
  cidadeUnidade: "GOIANIA - GO",
  telefoneUnidade: "(62) 3524-1824",
};

type BlocoConteudo = { label: string; texto: string; longText?: boolean };

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
  if (dateStr.includes("/")) return dateStr;
  const date = new Date(dateStr);
  return Number.isNaN(date.getTime()) ? dateStr : date.toLocaleDateString("pt-BR");
}

function formatEndereco(endereco?: ApiEndereco | null): string {
  if (!endereco) return "";
  return [
    endereco.tipo_logradouro,
    endereco.logradouro,
    endereco.numero !== "00" ? endereco.numero : null,
    endereco.complemento,
    endereco.bairro,
    endereco.cidade && `${endereco.cidade} - ${endereco.uf ?? ""}`,
  ]
    .filter(Boolean)
    .join(", ");
}

function nomeArquivo(data: ApiProntuarioResponse): string {
  const cpfDigits = (data.paciente.cpf || "").replace(/\D/g, "");
  const cdUsu = data.paciente.cd_usu_cadsus ?? data.paciente.id;
  const nomeSan = (data.paciente.nome || "PACIENTE")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "_")
    .toUpperCase();
  return `PRONTUARIO_${cdUsu}_${cpfDigits || data.paciente.id}_${nomeSan}.pdf`;
}

function normalizarTexto(texto?: string | null): string {
  return limparHtml(texto)
    .replace(/\S{70,}/g, (token) => token.match(/.{1,45}/g)?.join(" ") ?? token)
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function blocosConteudo(c: ApiRegistroConteudo): BlocoConteudo[] {
  const blocos: BlocoConteudo[] = [];
  const avaliacao = normalizarTexto(c.avaliacao);
  const evolucao = normalizarTexto(c.evolucao);
  const exame = normalizarTexto(c.exame);
  if (avaliacao) blocos.push({ label: "Avaliação", texto: avaliacao });
  if (evolucao) blocos.push({ label: "Evolução", texto: evolucao, longText: true });
  if (exame) blocos.push({ label: "Exame", texto: exame });
  return blocos;
}

function campo(label: string, value?: string | number | null, className = ""): string {
  return `
    <div class="pdf-field ${className}">
      <span class="pdf-label">${escapeHtml(label)}:</span>
      <span class="pdf-value">${escapeHtml(value || "—")}</span>
    </div>
  `;
}

function renderPaciente(data: ApiProntuarioResponse): string {
  const { paciente } = data;
  return `
    <section class="patient-section pdf-section">
      <h2>Dados do Paciente</h2>
      <div class="patient-grid">
        ${campo("Nome", `( ${paciente.id} ) ${paciente.nome || ""}`, "patient-name")}
        ${campo("Sexo", paciente.sexo)}
        ${campo("Nome da Mãe", paciente.nome_mae)}
        ${campo("Dt. Nascimento", paciente.data_nascimento)}
        ${campo("Endereço", formatEndereco(paciente.endereco), "patient-address")}
        ${campo("Telefone", paciente.telefone)}
        ${campo("CPF", paciente.cpf)}
      </div>
    </section>
  `;
}

function renderAtendimentoHeader(a: ApiAtendimento): string {
  const conselho = a.profissional?.tipo_conselho && a.profissional.registro
    ? ` (${a.profissional.tipo_conselho}: ${a.profissional.registro})`
    : "";

  return `
    <div class="atendimento-header">
      <div class="atendimento-main">
        <h3>${escapeHtml(a.unidade?.nome || "Unidade não informada")}</h3>
        ${a.tipo_atendimento ? campo("Tipo de Atendimento", a.tipo_atendimento) : ""}
        ${a.profissional?.nome ? campo("Profissional", `${a.profissional.nome}${conselho}`) : ""}
      </div>
      <div class="atendimento-meta">
        ${a.possui_aih ? `<span class="aih-badge">AIH SOLICITADA</span>` : ""}
        ${campo("Data Registro", formatDateBR(a.data_chegada))}
        ${a.numero_atendimento ? campo("Nº", a.numero_atendimento) : ""}
        ${a.classificacao_risco ? campo("Risco", a.classificacao_risco) : ""}
      </div>
    </div>
  `;
}

function renderAtendimento(a: ApiAtendimento): string {
  const registros = a.registros || [];
  const aih = a.possui_aih && a.aih_detalhes
    ? `
      <div class="aih-section pdf-section">
        <h4>DETALHES DA SOLICITAÇÃO DE INTERNAÇÃO</h4>
        <div class="content-block">
          <span class="content-label">Diagnóstico Inicial:</span>
          <div class="content-value long-text">${escapeHtml(normalizarTexto(a.aih_detalhes.diagnostico_inicial) || "Não informado")}</div>
        </div>
        <div class="content-block">
          <span class="content-label">Sinais e Sintomas:</span>
          <div class="content-value long-text">${escapeHtml(normalizarTexto(a.aih_detalhes.principais_sinais) || "Não informado")}</div>
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
              <strong>Tipo: ${escapeHtml(registro.tipo || "—")}</strong>
              <span>${escapeHtml(formatDateBR(registro.data))}</span>
            </div>
            ${blocos.length > 0
              ? blocos.map((b) => `
                <div class="content-block ${b.longText ? "evolucao-block" : ""}">
                  <span class="content-label">${escapeHtml(b.label)}:</span>
                  <div class="content-value ${b.longText ? "long-text" : ""}">${escapeHtml(b.texto)}</div>
                </div>
              `).join("")
              : `<p class="empty-text">(Sem conteúdo)</p>`}
          </section>
        `;
      }).join("")
    : (!a.possui_aih ? `<p class="empty-text sem-registro">(Sem registros clínicos)</p>` : "");

  return `
    <article class="atendimento-section pdf-section">
      ${renderAtendimentoHeader(a)}
      ${aih}
      ${registrosHtml}
    </article>
  `;
}

function renderHtml(data: ApiProntuarioResponse, logoBase64?: string): string {
  const atendimentos = [...(data.atendimentos || [])].sort(
    (a, b) => new Date(b.data_chegada || "").getTime() - new Date(a.data_chegada || "").getTime(),
  );

  return `<!doctype html>
    <html lang="pt-BR">
      <head>
        <meta charset="utf-8" />
        <title>${escapeHtml(nomeArquivo(data))}</title>
        <style>
          @page { size: A4 portrait; margin: 14mm 14mm 18mm; }
          @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
          #prontuario-impressao, #prontuario-impressao * { box-sizing: border-box; }
          body { margin: 0; background: #ffffff; color: #202020; font-family: Arial, Helvetica, sans-serif; }
          #prontuario-impressao { width: 100%; font-size: 11px; line-height: 1.35; }
          #prontuario-impressao .print-shell { width: 100%; border-collapse: collapse; }
          #prontuario-impressao .print-shell thead { display: table-header-group; }
          #prontuario-impressao .print-shell tfoot { display: table-footer-group; }
          #prontuario-impressao .print-shell td { padding: 0; vertical-align: top; }
          #prontuario-impressao .print-header {
            display: grid;
            grid-template-columns: 34mm 1fr 34mm;
            align-items: start;
            gap: 8px;
            border-bottom: 1px solid #b8b8b8;
            padding-bottom: 8px;
            margin-bottom: 14px;
          }
          #prontuario-impressao .logo { width: 30mm; max-height: 16mm; object-fit: contain; }
          #prontuario-impressao .header-text { display: flex; flex-direction: column; align-items: center; gap: 2px; text-align: center; }
          #prontuario-impressao h1, #prontuario-impressao h2, #prontuario-impressao h3, #prontuario-impressao h4, #prontuario-impressao p { margin: 0; }
          #prontuario-impressao h1 { margin-top: 4px; font-size: 14px; font-weight: 700; }
          #prontuario-impressao .prefeitura { font-size: 14px; font-weight: 700; }
          #prontuario-impressao .sistema { font-size: 12px; }
          #prontuario-impressao .orgao { font-size: 10px; }
          #prontuario-impressao .print-body { display: flex; flex-direction: column; gap: 12px; }
          #prontuario-impressao .pdf-section { break-inside: auto; page-break-inside: auto; }
          #prontuario-impressao .patient-section {
            display: flex;
            flex-direction: column;
            gap: 8px;
            border: 1px solid #b8b8b8;
            border-radius: 4px;
            background: #f5f7fa;
            padding: 10px;
          }
          #prontuario-impressao .patient-section h2 { font-size: 12px; font-weight: 700; }
          #prontuario-impressao .patient-grid { display: grid; grid-template-columns: 1fr 0.55fr; column-gap: 16px; row-gap: 6px; }
          #prontuario-impressao .patient-address, #prontuario-impressao .patient-name { grid-column: span 1; }
          #prontuario-impressao .pdf-field { display: flex; flex-wrap: wrap; align-items: baseline; gap: 0 8px; min-width: 0; }
          #prontuario-impressao .pdf-label { flex: 0 0 auto; font-weight: 700; color: #4f4f4f; }
          #prontuario-impressao .pdf-value { flex: 1 1 70px; min-width: 0; overflow-wrap: break-word; word-break: break-word; }
          #prontuario-impressao .atendimento-section { display: flex; flex-direction: column; gap: 12px; }
          #prontuario-impressao .atendimento-header {
            display: grid;
            grid-template-columns: minmax(0, 1fr) 54mm;
            gap: 14px;
            border: 1px solid #c4c9cf;
            border-radius: 4px;
            background: #dfe7f2;
            padding: 10px;
            break-inside: avoid;
            page-break-inside: avoid;
            break-after: avoid;
            page-break-after: avoid;
          }
          #prontuario-impressao .atendimento-main, #prontuario-impressao .atendimento-meta { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
          #prontuario-impressao .atendimento-main h3 { font-size: 13px; font-weight: 700; overflow-wrap: break-word; word-break: break-word; }
          #prontuario-impressao .atendimento-meta { text-align: right; align-items: flex-end; }
          #prontuario-impressao .atendimento-meta .pdf-field { justify-content: flex-end; }
          #prontuario-impressao .aih-badge {
            display: inline-block;
            background: #d1fae5;
            color: #065f46;
            border: 1px solid #6ee7b7;
            font-weight: 700;
            font-size: 10px;
            padding: 2px 8px;
            border-radius: 10px;
            letter-spacing: 0.3px;
          }
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
          #prontuario-impressao .print-footer {
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
        </style>
      </head>
      <body>
        <main id="prontuario-impressao">
          <table class="print-shell">
            <thead>
              <tr><td>
                <header class="print-header">
                  <div>${logoBase64 ? `<img class="logo" src="${logoBase64}" alt="Prefeitura de Goiânia" />` : ""}</div>
                  <div class="header-text">
                    <div class="prefeitura">${documentoPadrao.prefeitura}</div>
                    <div class="sistema">${documentoPadrao.sistema}</div>
                    <div class="orgao">${documentoPadrao.orgao}</div>
                    <h1>${documentoPadrao.titulo}</h1>
                  </div>
                  <div></div>
                </header>
              </td></tr>
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
              <tr><td>
                <footer class="print-footer">
                  <div>${documentoPadrao.enderecoUnidade}</div>
                  <strong>${documentoPadrao.cidadeUnidade} | ${documentoPadrao.telefoneUnidade}</strong>
                </footer>
              </td></tr>
            </tfoot>
          </table>
        </main>
        <script>
          window.addEventListener('load', () => setTimeout(() => window.print(), 250));
        </script>
      </body>
    </html>`;
}

export function imprimirProntuario(data: ApiProntuarioResponse, logoBase64?: string): void {
  const printWindow = window.open("", "_blank", "width=1024,height=768");
  if (!printWindow) throw new Error("Não foi possível abrir a janela de impressão.");
  printWindow.document.open();
  printWindow.document.write(renderHtml(data, logoBase64));
  printWindow.document.close();
}

export function obterNomeArquivoProntuario(data: ApiProntuarioResponse): string {
  return nomeArquivo(data);
}