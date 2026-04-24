import jsPDF from "jspdf";
import type { Paciente, ProntuarioRegistro } from "@/domain/models";
import logoGoianiaUrl from "@/assets/logo-goiania.png";

const MARGIN_X = 14;
const MARGIN_TOP = 14;
const MARGIN_BOTTOM = 22;
const LINE_H = 4.4;

let LOGO_DATA_URL: string | null = null;
let LOGO_DIMS: { w: number; h: number } | null = null;

async function ensureLogoLoaded(): Promise<void> {
  if (LOGO_DATA_URL && LOGO_DIMS) return;
  const res = await fetch(logoGoianiaUrl);
  const blob = await res.blob();
  LOGO_DATA_URL = await new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
  LOGO_DIMS = await new Promise<{ w: number; h: number }>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = reject;
    img.src = LOGO_DATA_URL!;
  });
}

function fmtDateBR(d: string | null | undefined) {
  if (!d) return "";
  if (d.includes("/")) return d;
  const [y, m, day] = d.split("-");
  if (!y || !m || !day) return d;
  return `${day}/${m}/${y}`;
}

function formatCpf(cpf: string | null | undefined) {
  if (!cpf) return "";
  const d = cpf.replace(/\D/g, "");
  if (d.length !== 11) return cpf;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

function nowStamp() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

interface RenderState {
  doc: jsPDF;
  y: number;
  pageW: number;
  pageH: number;
  page: number;
  totalPlaceholder: () => void;
}

function newDoc(): jsPDF {
  return new jsPDF({ unit: "mm", format: "a4" });
}

function drawHeader(state: RenderState, paciente: Paciente, isContinuation: boolean) {
  const { doc, pageW } = state;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Prefeitura Municipal de Goiânia - GO", pageW / 2, MARGIN_TOP, { align: "center" });
  doc.setFontSize(9);
  doc.text("SUS - SISTEMA ÚNICO DE SAÚDE", pageW / 2, MARGIN_TOP + 4.5, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.text("Secretaria Municipal de Saúde de Goiânia - GO", pageW / 2, MARGIN_TOP + 8.5, { align: "center" });

  doc.setFontSize(7);
  doc.setTextColor(90);
  doc.text(
    `Emitido em ${nowStamp()} | Sistema de Prontuário Eletrônico`,
    pageW / 2,
    MARGIN_TOP + 12.5,
    { align: "center" }
  );
  doc.setTextColor(0);

  doc.setLineWidth(0.3);
  doc.line(MARGIN_X, MARGIN_TOP + 14, pageW - MARGIN_X, MARGIN_TOP + 14);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("PRONTUÁRIO DE ATENDIMENTOS", pageW / 2, MARGIN_TOP + 19, { align: "center" });

  if (isContinuation) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.text(`Continuação da impressão do prontuário de ${paciente.nome}`, pageW / 2, MARGIN_TOP + 23, {
      align: "center",
    });
  }

  state.y = MARGIN_TOP + (isContinuation ? 27 : 23);
}

function drawPacienteBox(state: RenderState, paciente: Paciente) {
  const { doc, pageW } = state;
  const x = MARGIN_X;
  const w = pageW - MARGIN_X * 2;
  const startY = state.y;

  // Ajuste de altura do box para padding extra
  const boxHeight = 36 + 6; // 36 original + 6 de padding vertical
  const boxPaddingX = 6;
  const boxPaddingY = 3;
  doc.setFillColor(245, 247, 250);
  doc.setDrawColor(180);
  doc.roundedRect(x, startY, w, boxHeight, 1.5, 1.5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(40);
  doc.text("Dados do Paciente", x + boxPaddingX, startY + boxPaddingY + 4.5);

  const e = paciente.endereco;
  const enderecoStr = e
    ? [
        [e.tipoLogradouro, e.logradouro].filter(Boolean).join(" "),
        e.numero ? `Nº ${e.numero}` : null,
        e.bairro,
        [e.cidade, e.uf].filter(Boolean).join(" - "),
      ]
        .filter(Boolean)
        .join(", ")
    : "";

  const rows: Array<Array<[string, string]>> = [
    [
      ["Nome", `( ${paciente.id} ) ${paciente.nome}`],
      ["Sexo", paciente.sexo ?? ""],
    ],
    [
      ["Nome da Mãe", paciente.nomeMae ?? ""],
      ["Dt. Nascimento", fmtDateBR(paciente.dataNascimento)],
    ],
    [
      ["Endereço", enderecoStr],
      ["Idade", paciente.idade ?? ""],
    ],
    [
      ["CPF", formatCpf(paciente.cpf)],
      ["Telefone", paciente.telefone ?? ""],
    ],
  ];

  doc.setFontSize(8);
  doc.setTextColor(0);
  let cy = startY + boxPaddingY + 9;
  const colW = w / 2;
  const labelValueSpacing = 4; // Espaço extra entre label e valor
  rows.forEach((row) => {
    row.forEach(([label, val], i) => {
      const cx = x + boxPaddingX + i * colW;
      doc.setFont("helvetica", "bold");
      doc.text(`${label}:`, cx, cy, { baseline: "top" });
      doc.setFont("helvetica", "normal");
      const labelW = doc.getTextWidth(`${label}: `);
      const maxW = colW - 2 * boxPaddingX - labelW - labelValueSpacing;
      const truncated = doc.splitTextToSize(val || "—", maxW)[0] ?? "";
      doc.text(String(truncated), cx + labelW + labelValueSpacing, cy, { baseline: "top" });
    });
    cy += 6; // Espaçamento vertical maior para melhor leitura
  });

  state.y = startY + boxHeight + 4;
}

function ensureSpace(state: RenderState, paciente: Paciente, needed: number) {
  if (state.y + needed > state.pageH - MARGIN_BOTTOM) {
    drawFooter(state);
    state.doc.addPage();
    state.page += 1;
    drawHeader(state, paciente, true);
    drawPacienteBox(state, paciente);
  }
}

function drawFooter(state: RenderState) {
  const { doc, pageW, pageH } = state;
  doc.setDrawColor(180);
  doc.setLineWidth(0.2);
  doc.line(MARGIN_X, pageH - MARGIN_BOTTOM + 4, pageW - MARGIN_X, pageH - MARGIN_BOTTOM + 4);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(90);
  doc.text("Industrial - Setor Leste Vila Nova - CEP 74635-040", pageW / 2, pageH - MARGIN_BOTTOM + 8, {
    align: "center",
  });
  doc.setFont("helvetica", "bold");
  doc.text("GOIANIA - GO | (62) 3524-1824", pageW / 2, pageH - MARGIN_BOTTOM + 12, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.text(`Página ${state.page}`, pageW - MARGIN_X, pageH - MARGIN_BOTTOM + 12, { align: "right" });
  doc.setTextColor(0);
}

//
// ⭐⭐⭐ INSERÇÃO DO CARD DE ATENDIMENTO AQUI ⭐⭐⭐
//

function drawRegistro(state: RenderState, paciente: Paciente, reg: ProntuarioRegistro) {
  const { doc, pageW } = state;
  const x = MARGIN_X;
  const w = pageW - MARGIN_X * 2;

  //
  // --- CARD DE ATENDIMENTO ---
  //

  const cardH = 18;
  ensureSpace(state, paciente, cardH + 4);

  doc.setFillColor(245, 247, 250);
  doc.setDrawColor(180);
  doc.roundedRect(x, state.y, w, cardH, 1.5, 1.5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Atendimento", x + 3, state.y + 4);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);

  let lineY = state.y + 8;

  doc.text(`Unidade: ${reg.unidade || "—"}`, x + 3, lineY);
  lineY += 4;

  doc.text(`Profissional: ${reg.profissional || "—"}`, x + 3, lineY);
  lineY += 4;

  doc.text(
    `Tipo: ${reg.tipoRegistro || "—"} | Risco: ${reg.classificacaoRisco || "—"} | Dt: ${reg.dataRegistro}`,
    x + 3,
    lineY
  );

  state.y += cardH + 3;

  //
  // --- FIM DO CARD ---

  // Estimate block height
  doc.setFontSize(8);
  const conteudoLines = doc.splitTextToSize(reg.conteudo || "", w - 4);
  const estimated = 5 + 5 + 5 + conteudoLines.length * LINE_H + 4;
  ensureSpace(state, paciente, estimated);

  // Separator
  doc.setDrawColor(210);
  doc.setLineWidth(0.2);
  doc.line(x, state.y, x + w, state.y);
  state.y += 5; 

  // Linha 1: Profissional
  const labelValueSpacing = 3;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("Profissional:", x, state.y);
  doc.setFont("helvetica", "normal");
  const profLabelW = doc.getTextWidth("Profissional: ");
  const profLines = doc.splitTextToSize(reg.profissional || "—", w - profLabelW - labelValueSpacing);
  doc.text(profLines, x + profLabelW + labelValueSpacing, state.y);
  state.y += profLines.length * LINE_H;

  // Linha 2: Unidade
  doc.setFont("helvetica", "bold");
  doc.text("Unidade:", x, state.y);
  doc.setFont("helvetica", "normal");
  const uniLabelW = doc.getTextWidth("Unidade: ");
  const uniLines = doc.splitTextToSize(reg.unidade || "—", w - uniLabelW - labelValueSpacing);
  doc.text(uniLines, x + uniLabelW + labelValueSpacing, state.y);
  state.y += uniLines.length * LINE_H;

  // Linha 3: Dt Registro / Tipo / Classificação
  doc.setFont("helvetica", "bold");
  doc.text("Dt Registro:", x, state.y);
  doc.setFont("helvetica", "normal");
  const dtLabelW = doc.getTextWidth("Dt Registro: ");
  doc.text(reg.dataRegistro || "—", x + dtLabelW + labelValueSpacing, state.y);

  const meta2X = x + 70;
  doc.setFont("helvetica", "bold");
  doc.text("Tipo:", meta2X, state.y);
  doc.setFont("helvetica", "normal");
  const tipoLabelW = doc.getTextWidth("Tipo: ");
  doc.text(reg.tipoRegistro || "—", meta2X + tipoLabelW + labelValueSpacing, state.y);

  if (reg.classificacaoRisco) {
    const meta3X = x + 120;
    doc.setFont("helvetica", "bold");
    doc.text("Risco:", meta3X, state.y);
    doc.setFont("helvetica", "normal");
    const riscoLabelW = doc.getTextWidth("Risco: ");
    doc.text(reg.classificacaoRisco, meta3X + riscoLabelW + labelValueSpacing, state.y);
  }
  state.y += LINE_H + 1;

  // Conteúdo
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  for (const line of conteudoLines) {
    ensureSpace(state, paciente, LINE_H);
    doc.text(line, x, state.y);
    state.y += LINE_H;
  }
  state.y += 2;
}

export function gerarProntuarioPdf(paciente: Paciente, registros: ProntuarioRegistro[]) {
  const doc = newDoc();
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  const state: RenderState = {
    doc,
    y: 0,
    pageW,
    pageH,
    page: 1,
    totalPlaceholder: () => {},
  };

  drawHeader(state, paciente, false);
  drawPacienteBox(state, paciente);

  // Ordena por data desc (mantém ordem se já vier ordenado)
  const ordered = [...registros].sort((a, b) => {
    const pa = parseDate(a.dataRegistro);
    const pb = parseDate(b.dataRegistro);
    return pb - pa;
  });

  if (ordered.length === 0) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.text("Nenhum atendimento registrado.", MARGIN_X, state.y);
  } else {
    ordered.forEach((reg) => drawRegistro(state, paciente, reg));
  }

  drawFooter(state);

  // Atualiza páginas com total
  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    doc.setPage(p);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(90);
    doc.text(`Página ${p} de ${total}`, pageW - MARGIN_X, MARGIN_TOP + 19, { align: "right" });
    doc.setTextColor(0);
  }

  const cpfDigits = (paciente.cpf || "").replace(/\D/g, "");
  const fname = `prontuario_${cpfDigits || paciente.id}.pdf`;
  doc.save(fname);
}

function parseDate(s: string): number {
  const m = s?.match(/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}):(\d{2}))?/);
  if (!m) return 0;
  const [, dd, mm, yyyy, hh = "0", mi = "0", ss = "0"] = m;
  return new Date(+yyyy, +mm - 1, +dd, +hh, +mi, +ss).getTime();
}