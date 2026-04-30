import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

import type {
  ApiProntuarioResponse as MockProntuario,
  ApiAtendimento as MockAtendimento,
  ApiRegistro as MockRegistro,
  ApiRegistroConteudo as MockRegistroConteudo,
} from "@/lib/prontuarioApi";
import { limparHtml } from "@/lib/limparHtml";

function formatDateBR(dateStr?: string | null): string {
  if (!dateStr) return "";
  if (dateStr.includes("/")) return dateStr;
  
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString("pt-BR");
  } catch {
    return dateStr;
  }
}

function blocosConteudo(c: MockRegistroConteudo): { label: string; texto: string }[] {
  const out: { label: string; texto: string }[] = [];
  const av = limparHtml(c.avaliacao);
  const ev = limparHtml(c.evolucao);
  const ex = limparHtml(c.exame);
  if (av) out.push({ label: "Avaliação", texto: av });
  if (ev) out.push({ label: "Evolução", texto: ev });
  if (ex) out.push({ label: "Exame", texto: ex });
  return out;
}

const MAX_PDF_LINE_CHARS = 95;
const MAX_PDF_PARAGRAPH_CHARS = 520;

function quebrarTokenLongo(token: string): string {
  if (token.length <= MAX_PDF_LINE_CHARS) return token;
  return token.match(new RegExp(`.{1,${MAX_PDF_LINE_CHARS}}`, "g"))?.join("\u200B") ?? token;
}

function fatiarParagrafo(texto: string): string[] {
  const partes: string[] = [];
  let restante = texto.trim();

  while (restante.length > MAX_PDF_PARAGRAPH_CHARS) {
    const corteIdeal = restante.lastIndexOf(" ", MAX_PDF_PARAGRAPH_CHARS);
    const corte = corteIdeal > MAX_PDF_PARAGRAPH_CHARS * 0.65 ? corteIdeal : MAX_PDF_PARAGRAPH_CHARS;
    partes.push(restante.slice(0, corte).trim());
    restante = restante.slice(corte).trim();
  }

  if (restante) partes.push(restante);
  return partes;
}

function prepararConteudoPdf(texto: string): string[] {
  return texto
    .replace(/\r\n?/g, "\n")
    .split(/\n+/)
    .flatMap((linha) => {
      const segura = linha.replace(/\S{96,}/g, quebrarTokenLongo).trim();
      return segura ? fatiarParagrafo(segura) : [];
    });
}

const documentoPadrao = {
  titulo: "PRONTUÁRIO DE ATENDIMENTOS",
  prefeitura: "Prefeitura Municipal de Goiânia - GO",
  sistema: "SUS - SISTEMA ÚNICO DE SAÚDE",
  orgao: "Secretaria Municipal de Saúde de Goiânia - GO",
  enderecoUnidade: "Industrial - Setor Leste Vila Nova - CEP 74635-040",
  cidadeUnidade: "GOIANIA - GO",
  telefoneUnidade: "(62) 3524-1824",
};

interface Props {
  data: MockProntuario;
  logoBase64?: string;
}

const ProntuarioPDF = ({ data, logoBase64 }: Props) => {
  const atendimentos = [...(data.atendimentos || [])].sort(
    (a, b) => new Date(b.data_chegada || "").getTime() - new Date(a.data_chegada || "").getTime()
  );

  const { paciente } = data;

  const enderecoStr = paciente.endereco
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

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        {/* Header */}
        <View style={styles.headerContainer} fixed>
          <View style={styles.headerRow}>
            {logoBase64 ? <Image src={logoBase64} style={styles.logo} /> : <View style={styles.logo} />}
            <View style={styles.headerTextBlock}>
              <Text style={styles.headerLine1}>{documentoPadrao.prefeitura}</Text>
              <Text style={styles.headerLine2}>{documentoPadrao.sistema}</Text>
              <Text style={styles.headerLine3}>{documentoPadrao.orgao}</Text>
            </View>
          </View>
          <View style={styles.headerDivider} />
          <Text style={styles.title}>{documentoPadrao.titulo}</Text>
        </View>

        {/* Dados do Paciente */}
        <View style={styles.box}>
          <Text style={styles.boxTitle}>Dados do Paciente</Text>
          <View style={styles.row}>
            <Field label="Nome" value={`( ${paciente.id} ) ${paciente.nome || ""}`} flex={2} />
            <Field label="Sexo" value={paciente.sexo ?? ""} flex={1} />
          </View>
          <View style={styles.row}>
            <Field label="Nome da Mãe" value={paciente.nome_mae ?? ""} flex={2} />
            <Field label="Dt. Nascimento" value={paciente.data_nascimento ?? ""} flex={1} />
          </View>
          <View style={styles.row}>
            <Field label="Endereço" value={enderecoStr} flex={2} />
            <Field label="Telefone" value={paciente.telefone ?? ""} flex={1} />
          </View>
          <View style={styles.row}>
            <Field label="CPF" value={paciente.cpf ?? ""} flex={1} />
          </View>
        </View>

        {atendimentos.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum atendimento registrado.</Text>
        ) : (
          atendimentos.map((a, idx) => {
            const registros = a.registros || [];
            const primeiroRegistro = registros[0];
            const primeiroBlocos = primeiroRegistro ? blocosConteudo(primeiroRegistro.conteudo) : [];
            const restoRegistros = registros.slice(1);

            return (
              <View key={idx} style={styles.atendimento} wrap>
                {/* Cabeçalho + primeiro registro agrupados (não podem ser separados) */}
                <View wrap={false}>
                  <View style={styles.atendimentoHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.atendimentoTitle}>
                        {a.unidade?.nome || "Unidade não informada"}
                      </Text>
                      {a.tipo_atendimento && (
                        <Text style={styles.atendimentoSub}>
                          <Text style={styles.metaLabel}>Tipo de Atendimento: </Text>
                          {a.tipo_atendimento}
                        </Text>
                      )}
                      {a.profissional?.nome && (
                        <Text style={styles.atendimentoSub}>
                          <Text style={styles.metaLabel}>Profissional: </Text>
                          {a.profissional.nome}
                          {a.profissional.tipo_conselho && a.profissional.registro
                            ? ` (${a.profissional.tipo_conselho}: ${a.profissional.registro})`
                            : ""}
                        </Text>
                      )}
                    </View>

                    <View style={{ alignItems: "flex-end" }}>
                      <Text style={styles.atendimentoDate}>
                        <Text style={styles.metaLabel}>Data Registro: </Text>
                        {formatDateBR(a.data_chegada)}
                      </Text>
                      {a.numero_atendimento && <Text style={styles.atendimentoDate}>Nº {a.numero_atendimento}</Text>}
                      {a.classificacao_risco && <Text style={styles.atendimentoDate}>Risco: {a.classificacao_risco}</Text>}
                      {a.possui_aih && <Text style={styles.aihBadge}>AIH SOLICITADA</Text>}
                    </View>
                  </View>

                  {/* Bloco AIH âncora ao cabeçalho */}
                  {a.possui_aih && a.aih_detalhes && (
                    <View style={styles.aihBox}>
                      <Text style={styles.aihTitle}>DETALHES DA SOLICITAÇÃO DE INTERNAÇÃO</Text>
                      <Text style={styles.conteudo}>
                        <Text style={styles.metaLabel}>Diagnóstico Inicial: </Text>
                        {a.aih_detalhes.diagnostico_inicial || "Não informado"}
                      </Text>
                      <Text style={styles.conteudo}>
                        <Text style={styles.metaLabel}>Sinais e Sintomas: </Text>
                        {a.aih_detalhes.principais_sinais || "Não informado"}
                      </Text>
                    </View>
                  )}

                  {/* Primeiro registro: mantém apenas os cabeçalhos sem quebra; conteúdo grande quebra livremente */}
                  {primeiroRegistro ? (
                    <View style={styles.registro}>
                      <View style={styles.registroHeader} wrap={false} minPresenceAhead={36}>
                        <Text style={styles.registroProf}>
                          <Text style={styles.metaLabel}>Tipo: </Text>
                          {primeiroRegistro.tipo || "—"}
                        </Text>
                        <Text style={styles.registroDate}>{formatDateBR(primeiroRegistro.data)}</Text>
                      </View>
                      {primeiroBlocos.length === 0 ? (
                        <Text style={styles.conteudo}>(Sem conteúdo)</Text>
                      ) : (
                        <ConteudoPdf label={primeiroBlocos[0].label} texto={primeiroBlocos[0].texto} />
                      )}
                    </View>
                  ) : !a.possui_aih ? (
                    <Text style={[styles.conteudo, { fontStyle: "italic", padding: 8 }]}>
                      (Sem registros clínicos)
                    </Text>
                  ) : null}
                </View>

                {/* Blocos restantes do primeiro registro (podem quebrar livremente) */}
                {primeiroRegistro && primeiroBlocos.slice(1).map((b, bi) => (
                  <View key={`p-${bi}`} style={styles.registroExtra} wrap>
                    <ConteudoPdf label={b.label} texto={b.texto} />
                  </View>
                ))}

                {/* Demais registros (cada um mantém header+1ºbloco juntos) */}
                {restoRegistros.map((r, ri) => {
                  const blocos = blocosConteudo(r.conteudo);
                  return (
                    <View key={ri} style={styles.registro} wrap>
                      <View wrap={false}>
                        <View style={styles.registroHeader} wrap={false} minPresenceAhead={36}>
                          <Text style={styles.registroProf}>
                            <Text style={styles.metaLabel}>Tipo: </Text>
                            {r.tipo || "—"}
                          </Text>
                          <Text style={styles.registroDate}>{formatDateBR(r.data)}</Text>
                        </View>
                        {blocos.length === 0 ? (
                          <Text style={styles.conteudo}>(Sem conteúdo)</Text>
                        ) : (
                          <ConteudoPdf label={blocos[0].label} texto={blocos[0].texto} />
                        )}
                      </View>
                      {blocos.slice(1).map((b, bi) => (
                        <ConteudoPdf key={bi} label={b.label} texto={b.texto} />
                      ))}
                    </View>
                  );
                })}
              </View>
            );
          })
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <View style={styles.footerDivider} />
          <Text style={styles.footerText}>{documentoPadrao.enderecoUnidade}</Text>
          <Text style={styles.footerTextBold}>
            {documentoPadrao.cidadeUnidade} | {documentoPadrao.telefoneUnidade}
          </Text>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  );
};

// Componente Field (mantido igual)
const Field = ({ label, value, flex = 1 }: { label: string; value: string; flex?: number }) => (
  <View style={[styles.field, { flex }]}>
    <Text style={styles.fieldLabel}>{label}:</Text>
    <Text style={styles.fieldValue}>{value || "—"}</Text>
  </View>
);

const styles = StyleSheet.create({
  page: { paddingTop: 90, paddingBottom: 110, paddingHorizontal: 32, fontSize: 9, fontFamily: "Helvetica", color: "#111" },
  headerContainer: { position: "absolute", top: 16, left: 32, right: 32 },
  headerRow: { flexDirection: "row", alignItems: "center" },
  logo: { width: 60, height: 24, objectFit: "contain" },
  headerTextBlock: { flex: 1, alignItems: "center" },
  headerLine1: { fontSize: 11, fontFamily: "Helvetica-Bold" },
  headerLine2: { fontSize: 9 },
  headerLine3: { fontSize: 9 },
  headerDivider: { marginTop: 4, borderBottomWidth: 0.5, borderBottomColor: "#999" },
  title: { marginTop: 6, fontSize: 12, fontFamily: "Helvetica-Bold", textAlign: "center" },

  box: { borderWidth: 0.5, borderColor: "#aaa", backgroundColor: "#f5f7fa", borderRadius: 3, padding: 9, marginBottom: 12 },
  boxTitle: { fontFamily: "Helvetica-Bold", fontSize: 10, marginBottom: 6 },
  row: { flexDirection: "row", marginBottom: 4, gap: 8 },
  field: { flexDirection: "row", paddingRight: 6 },
  fieldLabel: { fontFamily: "Helvetica-Bold", marginRight: 4 },
  fieldValue: { flexShrink: 1 },

  atendimento: { borderWidth: 0.5, borderColor: "#bbb", borderRadius: 3, marginBottom: 10 },
  atendimentoHeader: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#dde6f0", padding: 8 },
  atendimentoTitle: { fontFamily: "Helvetica-Bold", fontSize: 9.5 },
  atendimentoSub: { fontSize: 8, color: "#444", marginTop: 2 },
  atendimentoDate: { fontSize: 8, textAlign: "right" },

  aihBadge: { fontSize: 7.5, fontFamily: "Helvetica-Bold", color: "#1e40af", backgroundColor: "#dbeafe", padding: "2 6", borderRadius: 2 },
  aihBox: { backgroundColor: "#eff6ff", borderWidth: 1, borderColor: "#93c5fd", borderRadius: 3, padding: 8, marginVertical: 6, marginHorizontal: 6 },
  aihTitle: { fontFamily: "Helvetica-Bold", fontSize: 9.5, color: "#1e40af", marginBottom: 5 },

  registro: { padding: 8, borderTopWidth: 0.4, borderTopColor: "#ddd" },
  registroExtra: { paddingHorizontal: 8, paddingBottom: 6 },
  registroHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  registroProf: { fontSize: 8.5, fontFamily: "Helvetica-Bold", flex: 1 },
  registroDate: { fontSize: 8 },

  metaLabel: { fontFamily: "Helvetica-Bold" },
  conteudo: {
    fontSize: 8.5,
    lineHeight: 1.45,
    marginTop: 2,
    // Garante quebra de palavras longas dentro do container, evitando estouro lateral
    wordBreak: "break-word",
    overflowWrap: "break-word",
  } as never,
  emptyText: { fontSize: 9, fontStyle: "italic", textAlign: "center", marginTop: 20 },

  footer: { position: "absolute", bottom: 16, left: 32, right: 32 },
  footerDivider: { borderTopWidth: 0.5, borderTopColor: "#999", marginBottom: 4 },
  footerText: { fontSize: 7, color: "#666", textAlign: "center" },
  footerTextBold: { fontSize: 7, fontFamily: "Helvetica-Bold", textAlign: "center" },
  pageNumber: { position: "absolute", right: 0, bottom: 0, fontSize: 7, color: "#666" },
});

export default ProntuarioPDF;