import { jsPDF } from "jspdf";

import type {
  ApiAtendimento,
  ApiProntuarioResponse,
  ApiRegistroConteudo,
} from "@/lib/prontuarioApi";
import { limparHtml } from "@/lib/limparHtml";

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN_X = 16;
const HEADER_H = 37;
const FOOTER_H = 20;
const CONTENT_TOP = 47;
const CONTENT_BOTTOM = PAGE_HEIGHT - FOOTER_H - 13;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2;
const LINE_H = 4.4;

const documentoPadrao = {
  titulo: "PRONTUÁRIO DE ATENDIMENTOS",
  prefeitura: "Prefeitura Municipal de Goiânia - GO",
  sistema: "SUS - SISTEMA ÚNICO DE SAÚDE",
  orgao: "Secretaria Municipal de Saúde de Goiânia - GO",
  enderecoUnidade: "Industrial - Setor Leste Vila Nova - CEP 74635-040",
  cidadeUnidade: "GOIANIA - GO",
  telefoneUnidade: "(62) 3524-1824",
};

type PdfBlock = { label: string; texto: string };

function formatDateBR(dateStr?: string | null): string {
  if (!dateStr) return "";
  if (dateStr.includes("/")) return dateStr;
  const date = new Date(dateStr);
  return Number.isNaN(date.getTime()) ? dateStr : date.toLocaleDateString("pt-BR");
}

function blocosConteudo(c: ApiRegistroConteudo): PdfBlock[] {
  const blocos: PdfBlock[] = [];
  const avaliacao = limparHtml(c.avaliacao);
  const evolucao = limparHtml(c.evolucao);
  const exame = limparHtml(c.exame);
  if (avaliacao) blocos.push({ label: "Avaliação", texto: avaliacao });
  if (evolucao) blocos.push({ label: "Evolução", texto: evolucao });
  if (exame) blocos.push({ label: "Exame", texto: exame });
  return blocos;
}

function protegerTokensLongos(texto: string): string {
  return texto.replace(/\S{55,}/g, (token) => token.match(/.{1,45}/g)?.join(" ") ?? token);
}

function prepararTexto(texto?: string | null): string {
  return protegerTokensLongos(limparHtml(texto)).replace(/[ \t]{2,}/g, " ").trim();
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

class ProntuarioPdfBuilder {
  private doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
  private pageCount = 1;
  private y = CONTENT_TOP;

  constructor(private logoBase64?: string) {
    this.drawChrome();
  }

  outputBlob(): Blob {
    const total = this.doc.getNumberOfPages();
    for (let i = 1; i <= total; i += 1) {
      this.doc.setPage(i);
      this.doc.setFont("helvetica", "normal");
      this.doc.setFontSize(7);
      this.doc.setTextColor(95, 95, 95);
      this.doc.text(`Página ${i} de ${total}`, PAGE_WIDTH - MARGIN_X, PAGE_HEIGHT - 14, { align: "right" });
    }
    return this.doc.output("blob");
  }

  addPatientBox(data: ApiProntuarioResponse) {
    const { paciente } = data;
    const endereco = paciente.endereco
      ? [
          paciente.endereco.tipo_logradouro,
          paciente.endereco.logradouro,
          paciente.endereco.numero !== "00" ? paciente.endereco.numero : null,
          paciente.endereco.complemento,
          paciente.endereco.bairro,
          paciente.endereco.cidade && `${paciente.endereco.cidade} - ${paciente.endereco.uf ?? ""}`,
        ]
          .filter(Boolean)
          .join(", ")
      : "";

    this.ensureSpace(30);
    const startY = this.y;
    this.doc.setFillColor(245, 247, 250);
    this.doc.setDrawColor(170, 170, 170);
    this.doc.roundedRect(MARGIN_X, startY, CONTENT_WIDTH, 29, 1.5, 1.5, "FD");
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(9);
    this.doc.setTextColor(20, 20, 20);
    this.doc.text("Dados do Paciente", MARGIN_X + 3, startY + 5.5);
    this.y = startY + 11;
    this.fieldLine([
      ["Nome", `( ${paciente.id} ) ${paciente.nome || ""}`],
      ["Sexo", paciente.sexo ?? ""],
    ]);
    this.fieldLine([
      ["Nome da Mãe", paciente.nome_mae ?? ""],
      ["Dt. Nascimento", paciente.data_nascimento ?? ""],
    ]);
    this.fieldLine([
      ["Endereço", endereco],
      ["Telefone", paciente.telefone ?? ""],
    ]);
    this.fieldLine([["CPF", paciente.cpf ?? ""]]);
    this.y = startY + 34;
  }

  addEmpty() {
    this.ensureSpace(8);
    this.doc.setFont("helvetica", "italic");
    this.doc.setFontSize(8.5);
    this.doc.text("Nenhum atendimento registrado.", PAGE_WIDTH / 2, this.y, { align: "center" });
    this.y += 7;
  }

  addAtendimento(a: ApiAtendimento) {
    this.ensureSpace(24);
    const headerHeight = this.getAtendimentoHeaderHeight(a);
    const startY = this.y;
    this.doc.setFillColor(221, 230, 240);
    this.doc.setDrawColor(185, 185, 185);
    this.doc.roundedRect(MARGIN_X, startY, CONTENT_WIDTH, headerHeight, 1.5, 1.5, "FD");

    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(9.5);
    this.doc.setTextColor(18, 18, 18);
    this.doc.text(a.unidade?.nome || "Unidade não informada", MARGIN_X + 3, startY + 6, { maxWidth: 118 });

    this.doc.setFontSize(8);
    this.doc.setTextColor(60, 60, 60);
    let leftY = startY + 11;
    if (a.tipo_atendimento) {
      this.richLine("Tipo de Atendimento: ", a.tipo_atendimento, MARGIN_X + 3, leftY, 118);
      leftY += 4.2;
    }
    if (a.profissional?.nome) {
      const conselho = a.profissional.tipo_conselho && a.profissional.registro
        ? ` (${a.profissional.tipo_conselho}: ${a.profissional.registro})`
        : "";
      this.richLine("Profissional: ", `${a.profissional.nome}${conselho}`, MARGIN_X + 3, leftY, 118);
    }

    const rightX = PAGE_WIDTH - MARGIN_X - 3;
    this.richLine("Data Registro: ", formatDateBR(a.data_chegada), rightX, startY + 6, 46, "right");
    if (a.numero_atendimento) this.doc.text(`Nº ${a.numero_atendimento}`, rightX, startY + 10.2, { align: "right" });
    if (a.classificacao_risco) this.doc.text(`Risco: ${a.classificacao_risco}`, rightX, startY + 14.4, { align: "right" });

    this.y = startY + headerHeight + 2;

    if (a.possui_aih && a.aih_detalhes) {
      this.addSectionLabel("DETALHES DA SOLICITAÇÃO DE INTERNAÇÃO");
      this.addTextBlock("Diagnóstico Inicial", a.aih_detalhes.diagnostico_inicial || "Não informado");
      this.addTextBlock("Sinais e Sintomas", a.aih_detalhes.principais_sinais || "Não informado");
    }

    const registros = a.registros || [];
    if (registros.length === 0 && !a.possui_aih) {
      this.addItalic("(Sem registros clínicos)");
    }

    registros.forEach((registro) => {
      this.ensureSpace(16);
      this.doc.setDrawColor(222, 222, 222);
      this.doc.line(MARGIN_X + 3, this.y, PAGE_WIDTH - MARGIN_X - 3, this.y);
      this.y += 4.2;
      this.doc.setFont("helvetica", "bold");
      this.doc.setFontSize(8.3);
      this.doc.setTextColor(25, 25, 25);
      this.doc.text(`Tipo: ${registro.tipo || "—"}`, MARGIN_X + 3, this.y);
      this.doc.setFont("helvetica", "normal");
      this.doc.text(formatDateBR(registro.data), PAGE_WIDTH - MARGIN_X - 3, this.y, { align: "right" });
      this.y += 4.2;

      const blocos = blocosConteudo(registro.conteudo);
      if (blocos.length === 0) {
        this.addItalic("(Sem conteúdo)");
      } else {
        blocos.forEach((b) => this.addTextBlock(b.label, b.texto));
      }
    });

    this.y += 5;
  }

  private fieldLine(fields: [string, string][]) {
    const colW = CONTENT_WIDTH / fields.length;
    fields.forEach(([label, value], idx) => {
      const x = MARGIN_X + 3 + idx * colW;
      this.doc.setFont("helvetica", "bold");
      this.doc.setFontSize(7.7);
      this.doc.text(`${label}:`, x, this.y);
      this.doc.setFont("helvetica", "normal");
      const labelW = this.doc.getTextWidth(`${label}: `);
      const lines = this.doc.splitTextToSize(value || "—", colW - labelW - 5).slice(0, 1);
      this.doc.text(lines, x + labelW, this.y);
    });
    this.y += 4.2;
  }

  private addSectionLabel(text: string) {
    this.ensureSpace(8);
    this.doc.setFillColor(239, 246, 255);
    this.doc.setDrawColor(147, 197, 253);
    this.doc.roundedRect(MARGIN_X + 3, this.y, CONTENT_WIDTH - 6, 7, 1, 1, "FD");
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(8.2);
    this.doc.setTextColor(30, 64, 175);
    this.doc.text(text, MARGIN_X + 5, this.y + 4.7);
    this.y += 9;
  }

  private addTextBlock(label: string, texto: string) {
    const normalized = prepararTexto(texto);
    this.ensureSpace(11);
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(8.2);
    this.doc.setTextColor(20, 20, 20);
    this.doc.text(`${label}:`, MARGIN_X + 3, this.y);
    this.y += 4.2;

    if (!normalized) {
      this.addItalic("(Sem conteúdo)");
      return;
    }

    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(8.2);
    this.doc.setTextColor(20, 20, 20);

    normalized.split(/\n+/).forEach((paragraph) => {
      const lines = this.doc.splitTextToSize(paragraph.trim(), CONTENT_WIDTH - 7) as string[];
      lines.forEach((line) => {
        this.ensureSpace(LINE_H + 1);
        this.doc.text(line, MARGIN_X + 3, this.y, { maxWidth: CONTENT_WIDTH - 7 });
        this.y += LINE_H;
      });
      this.y += 1.2;
    });
  }

  private addItalic(text: string) {
    this.ensureSpace(6);
    this.doc.setFont("helvetica", "italic");
    this.doc.setFontSize(8.2);
    this.doc.setTextColor(80, 80, 80);
    this.doc.text(text, MARGIN_X + 3, this.y);
    this.y += 5;
  }

  private richLine(label: string, value: string, x: number, y: number, maxWidth: number, align: "left" | "right" = "left") {
    if (align === "right") {
      this.doc.setFont("helvetica", "normal");
      this.doc.text(`${label}${value}`, x, y, { align: "right", maxWidth });
      return;
    }
    this.doc.setFont("helvetica", "bold");
    this.doc.text(label, x, y);
    this.doc.setFont("helvetica", "normal");
    this.doc.text(value, x + this.doc.getTextWidth(label), y, { maxWidth: maxWidth - this.doc.getTextWidth(label) });
  }

  private getAtendimentoHeaderHeight(a: ApiAtendimento): number {
    let h = 11;
    if (a.tipo_atendimento) h += 4.2;
    if (a.profissional?.nome) h += 4.2;
    return Math.max(17, h);
  }

  private ensureSpace(required: number) {
    if (this.y + required <= CONTENT_BOTTOM) return;
    this.doc.addPage();
    this.pageCount += 1;
    this.y = CONTENT_TOP;
    this.drawChrome();
  }

  private drawChrome() {
    this.doc.setFont("helvetica", "normal");
    this.doc.setTextColor(20, 20, 20);
    if (this.logoBase64) {
      try {
        this.doc.addImage(this.logoBase64, "PNG", MARGIN_X, 12, 26, 12, undefined, "FAST");
      } catch {
        // Se o formato do logo não for aceito pelo jsPDF, apenas omite a imagem.
      }
    }

    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(13);
    this.doc.text(documentoPadrao.prefeitura, PAGE_WIDTH / 2, 15, { align: "center" });
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(11);
    this.doc.text(documentoPadrao.sistema, PAGE_WIDTH / 2, 20.5, { align: "center" });
    this.doc.setFontSize(9.5);
    this.doc.text(documentoPadrao.orgao, PAGE_WIDTH / 2, 25.5, { align: "center" });
    this.doc.setDrawColor(170, 170, 170);
    this.doc.line(MARGIN_X, 31, PAGE_WIDTH - MARGIN_X, 31);
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(12);
    this.doc.text(documentoPadrao.titulo, PAGE_WIDTH / 2, HEADER_H, { align: "center" });

    this.doc.setDrawColor(170, 170, 170);
    this.doc.line(MARGIN_X, PAGE_HEIGHT - 25, PAGE_WIDTH - MARGIN_X, PAGE_HEIGHT - 25);
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(7.5);
    this.doc.setTextColor(100, 100, 100);
    this.doc.text(documentoPadrao.enderecoUnidade, PAGE_WIDTH / 2, PAGE_HEIGHT - 20, { align: "center" });
    this.doc.setFont("helvetica", "bold");
    this.doc.setTextColor(20, 20, 20);
    this.doc.text(`${documentoPadrao.cidadeUnidade} | ${documentoPadrao.telefoneUnidade}`, PAGE_WIDTH / 2, PAGE_HEIGHT - 15.5, { align: "center" });
  }
}

export function gerarProntuarioPdfJs(data: ApiProntuarioResponse, logoBase64?: string): { blob: Blob; fileName: string } {
  const builder = new ProntuarioPdfBuilder(logoBase64);
  builder.addPatientBox(data);
  const atendimentos = [...(data.atendimentos || [])].sort(
    (a, b) => new Date(b.data_chegada || "").getTime() - new Date(a.data_chegada || "").getTime(),
  );
  if (atendimentos.length === 0) {
    builder.addEmpty();
  } else {
    atendimentos.forEach((atendimento) => builder.addAtendimento(atendimento));
  }
  return { blob: builder.outputBlob(), fileName: nomeArquivo(data) };
}