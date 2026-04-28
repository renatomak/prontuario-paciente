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

function parseDate(str?: string | null) {
  if (!str) return 0;
  const datePart = str.split(" ")[0];
  const [dd, mm, yyyy] = datePart.split("/");
  if (!dd || !mm || !yyyy) return 0;
  return new Date(`${yyyy}-${mm}-${dd}`).getTime();
}

function sortAtendimentos(atendimentos: MockAtendimento[] = []) {
  return [...atendimentos].sort(
    (a, b) => parseDate(b.data_chegada) - parseDate(a.data_chegada),
  );
}

// Strip simples de HTML (sem DOM, pois roda no react-pdf).
function htmlToText(html?: string | null): string {
  if (!html) return "";
  return html
    .replace(/<\s*br\s*\/?\s*>/gi, "\n")
    .replace(/<\/\s*(p|div|li|tr|h[1-6])\s*>/gi, "\n")
    .replace(/<\s*li\s*[^>]*>/gi, "• ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function blocosConteudo(c: MockRegistroConteudo): { label: string; texto: string }[] {
  const out: { label: string; texto: string }[] = [];
  const av = htmlToText(c.avaliacao);
  const ev = htmlToText(c.evolucao);
  const ex = htmlToText(c.exame);
  if (av) out.push({ label: "Avaliação", texto: av });
  if (ev) out.push({ label: "Evolução", texto: ev });
  if (ex) out.push({ label: "Exame", texto: ex });
  return out;
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
  const atendimentos = sortAtendimentos(data.atendimentos);
  const { paciente } = data;
  const documento = documentoPadrao;

  const enderecoStr = paciente.endereco
    ? [
        paciente.endereco.tipo_logradouro,
        paciente.endereco.logradouro,
        paciente.endereco.numero,
        paciente.endereco.bairro,
        paciente.endereco.cidade && `${paciente.endereco.cidade} - ${paciente.endereco.uf ?? ""}`,
      ]
        .filter(Boolean)
        .join(", ")
    : "";

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.headerContainer} fixed>
          <View style={styles.headerRow}>
            {logoBase64 ? <Image src={logoBase64} style={styles.logo} /> : <View style={styles.logo} />}
            <View style={styles.headerTextBlock}>
              <Text style={styles.headerLine1}>{documento.prefeitura}</Text>
              <Text style={styles.headerLine2}>{documento.sistema}</Text>
              <Text style={styles.headerLine3}>{documento.orgao}</Text>
            </View>
          </View>
          <View style={styles.headerDivider} />
          <Text style={styles.title}>{documento.titulo}</Text>
        </View>

        <View style={styles.box}>
          <Text style={styles.boxTitle}>Dados do Paciente</Text>
          <View style={styles.row}>
            <Field label="Nome" value={`( ${paciente.id} ) ${paciente.nome}`} flex={2} />
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
            const prof = a.profissional;
            const profStr = prof
              ? [
                  prof.nome,
                  prof.tipo_conselho && prof.registro
                    ? `${prof.tipo_conselho}: ${prof.registro}`
                    : null,
                  prof.cbo
                    ? `CBO: (${prof.cbo})${prof.cbo_descricao ? " " + prof.cbo_descricao : ""}`
                    : null,
                ]
                  .filter(Boolean)
                  .join("   ")
              : "";
            return (
              <View key={idx} style={styles.atendimento}>
                <View style={styles.atendimentoHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.atendimentoTitle}>
                      {a.unidade?.nome}
                      {a.unidade?.telefone ? ` (${a.unidade.telefone})` : ""}
                    </Text>
                    {a.tipo_atendimento && (
                      <Text style={styles.atendimentoSub}>{a.tipo_atendimento}</Text>
                    )}
                    {profStr ? <Text style={styles.atendimentoSub}>{profStr}</Text> : null}
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={styles.atendimentoDate}>Chegada: {a.data_chegada}</Text>
                    {a.numero_atendimento && (
                      <Text style={styles.atendimentoDate}>Nº {a.numero_atendimento}</Text>
                    )}
                    {a.classificacao_risco && (
                      <Text style={styles.atendimentoDate}>Risco: {a.classificacao_risco}</Text>
                    )}
                  </View>
                </View>

                {(a.registros ?? []).length === 0 && (
                  <Text style={[styles.conteudo, { fontStyle: "italic", padding: 6 }]}>
                    (Sem registros clínicos)
                  </Text>
                )}

                {a.registros?.map((r: MockRegistro, ri) => {
                  const blocos = blocosConteudo(r.conteudo);
                  return (
                    <View key={ri} style={styles.registro} wrap={false}>
                      <View style={styles.registroHeader}>
                        <Text style={styles.registroProf}>
                          <Text style={styles.metaLabel}>Tipo: </Text>
                          {r.tipo || "—"}
                        </Text>
                        <Text style={styles.registroDate}>{r.data}</Text>
                      </View>
                      {blocos.length === 0 && (
                        <Text style={styles.conteudo}>(Sem conteúdo)</Text>
                      )}
                      {blocos.map((b, bi) => (
                        <Text key={bi} style={styles.conteudo}>
                          <Text style={styles.metaLabel}>{b.label}: </Text>
                          {b.texto}
                        </Text>
                      ))}
                    </View>
                  );
                })}
              </View>
            );
          })
        )}

        <View style={styles.footer} fixed>
          <View style={styles.footerDivider} />
          <Text style={styles.footerText}>{documento.enderecoUnidade}</Text>
          <Text style={styles.footerTextBold}>
            {documento.cidadeUnidade} | {documento.telefoneUnidade}
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

const Field = ({ label, value, flex = 1 }: { label: string; value: string; flex?: number }) => (
  <View style={[styles.field, { flex }]}>
    <Text style={styles.fieldLabel}>{label}:</Text>
    <Text style={styles.fieldValue}>{value || "—"}</Text>
  </View>
);

const styles = StyleSheet.create({
  page: {
    paddingTop: 90,
    paddingBottom: 60,
    paddingHorizontal: 32,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#111",
  },
  headerContainer: { position: "absolute", top: 16, left: 32, right: 32 },
  headerRow: { flexDirection: "row", alignItems: "center" },
  logo: { width: 60, height: 24, objectFit: "contain" },
  headerTextBlock: { flex: 1, alignItems: "center" },
  headerLine1: { fontSize: 11, fontFamily: "Helvetica-Bold" },
  headerLine2: { fontSize: 9 },
  headerLine3: { fontSize: 9 },
  headerDivider: { marginTop: 4, borderBottomWidth: 0.5, borderBottomColor: "#999" },
  title: { marginTop: 6, fontSize: 12, fontFamily: "Helvetica-Bold", textAlign: "center" },
  box: {
    borderWidth: 0.5,
    borderColor: "#aaa",
    backgroundColor: "#f5f7fa",
    borderRadius: 3,
    padding: 8,
    marginBottom: 10,
  },
  boxTitle: { fontFamily: "Helvetica-Bold", fontSize: 10, marginBottom: 6 },
  row: { flexDirection: "row", marginBottom: 4, gap: 6 },
  field: { flexDirection: "row", paddingRight: 6 },
  fieldLabel: { fontFamily: "Helvetica-Bold", marginRight: 3 },
  fieldValue: { flexShrink: 1 },
  atendimento: { borderWidth: 0.5, borderColor: "#bbb", borderRadius: 3, marginBottom: 10 },
  atendimentoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#dde6f0",
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  atendimentoTitle: { fontFamily: "Helvetica-Bold", fontSize: 9.5 },
  atendimentoSub: { fontSize: 8, color: "#444", marginTop: 1 },
  atendimentoDate: { fontSize: 8 },
  registro: {
    paddingHorizontal: 6,
    paddingVertical: 5,
    borderTopWidth: 0.4,
    borderTopColor: "#ddd",
  },
  registroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  registroProf: { fontSize: 8.5, fontFamily: "Helvetica-Bold", flex: 1, paddingRight: 6 },
  registroDate: { fontSize: 8 },
  metaLabel: { fontFamily: "Helvetica-Bold" },
  conteudo: { fontSize: 8.5, lineHeight: 1.4, textAlign: "justify", marginTop: 2 },
  emptyText: { fontSize: 9, fontStyle: "italic", textAlign: "center", marginTop: 20 },
  footer: { position: "absolute", bottom: 16, left: 32, right: 32 },
  footerDivider: { borderTopWidth: 0.5, borderTopColor: "#999", marginBottom: 4 },
  footerText: { fontSize: 7, color: "#666", textAlign: "center" },
  footerTextBold: { fontSize: 7, fontFamily: "Helvetica-Bold", textAlign: "center" },
  pageNumber: { position: "absolute", right: 0, bottom: 0, fontSize: 7, color: "#666" },
});

export default ProntuarioPDF;
