import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import type {
  MockProntuario,
  MockAtendimento,
  MockRegistro,
  MockRegistroConteudo,
} from "@/data/patientMock";

function parseDate(str?: string | null) {
  if (!str) return 0;
  const datePart = str.split(" ")[0];
  const [dd, mm, yyyy] = datePart.split("/");
  if (!dd || !mm || !yyyy) return 0;
  return new Date(`${yyyy}-${mm}-${dd}`).getTime();
}

function sortAtendimentos(atendimentos: MockAtendimento[] = []) {
  return [...atendimentos].sort((a, b) => parseDate(b.chegada) - parseDate(a.chegada));
}

function linhasConteudo(c: MockRegistroConteudo): { label?: string; texto: string }[] {
  const linhas: { label?: string; texto: string }[] = [];
  if (c.subtitulo) linhas.push({ texto: c.subtitulo });
  if (c.motivoConsulta) linhas.push({ label: "Motivo", texto: c.motivoConsulta });
  if (c.historico) linhas.push({ label: "Histórico", texto: c.historico });
  if (c.evolucao) linhas.push({ label: "Evolução", texto: c.evolucao });
  if (c.observacao) linhas.push({ label: "Obs.", texto: c.observacao });
  const antro: string[] = [];
  if (c.peso != null) antro.push(`Peso: ${c.peso}kg`);
  if (c.altura != null) antro.push(`Altura: ${c.altura}cm`);
  if (c.perimetroCefalico != null) antro.push(`PC: ${c.perimetroCefalico}cm`);
  if (antro.length) linhas.push({ texto: antro.join("   |   ") });
  if (c.cid?.codigo) linhas.push({ label: "CID", texto: `${c.cid.codigo} - ${c.cid.descricao ?? ""}` });
  if (c.procedimentos?.length)
    linhas.push({ label: "Procedimentos", texto: c.procedimentos.join("; ") });
  if (c.exames?.itens?.length)
    linhas.push({
      label: `Exames (${c.exames.grupo ?? ""})`,
      texto: c.exames.itens.join("; "),
    });
  return linhas;
}

interface Props {
  data: MockProntuario;
  logoBase64?: string;
}

const ProntuarioPDF = ({ data, logoBase64 }: Props) => {
  const atendimentos = sortAtendimentos(data.atendimentos);
  const { paciente, documento } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        {/* Cabeçalho fixo */}
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

        {/* Dados do paciente */}
        <View style={styles.box}>
          <Text style={styles.boxTitle}>Dados do Paciente</Text>
          <View style={styles.row}>
            <Field label="Nome" value={`( ${paciente.id} ) ${paciente.nome}`} flex={2} />
            <Field label="Sexo" value={paciente.sexo} flex={1} />
          </View>
          <View style={styles.row}>
            <Field label="Nome da Mãe" value={paciente.mae} flex={2} />
            <Field label="Dt. Nascimento" value={paciente.dataNascimento} flex={1} />
          </View>
          <View style={styles.row}>
            <Field
              label="Endereço"
              value={`${paciente.endereco.rua} - ${paciente.endereco.cidade}`}
              flex={2}
            />
            <Field label="Idade" value={paciente.idade} flex={1} />
          </View>
          <View style={styles.row}>
            <Field label="CPF" value={paciente.cpf} flex={1} />
            <Field label="CNS" value={paciente.cns} flex={1} />
            <Field label="Telefone" value={paciente.telefone} flex={1} />
          </View>
        </View>

        {/* Atendimentos */}
        {atendimentos.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum atendimento registrado.</Text>
        ) : (
          atendimentos.map((a, idx) => (
            <View key={idx} style={styles.atendimento}>
              <View style={styles.atendimentoHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.atendimentoTitle}>{a.unidade}</Text>
                  {a.tipoAtendimento && (
                    <Text style={styles.atendimentoSub}>{a.tipoAtendimento}</Text>
                  )}
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.atendimentoDate}>Chegada: {a.chegada}</Text>
                  {a.numeroAtendimento && (
                    <Text style={styles.atendimentoDate}>Nº {a.numeroAtendimento}</Text>
                  )}
                </View>
              </View>

              {a.registros?.map((r: MockRegistro, ri) => (
                <View key={ri} style={styles.registro} wrap={false}>
                  <View style={styles.registroHeader}>
                    <Text style={styles.registroProf}>
                      {r.profissional?.nome}
                      {r.profissional?.tipoRegistro && r.profissional?.registro
                        ? ` (${r.profissional.tipoRegistro} ${r.profissional.registro})`
                        : ""}
                    </Text>
                    <Text style={styles.registroDate}>{r.dataRegistro}</Text>
                  </View>
                  <Text style={styles.registroMeta}>
                    <Text style={styles.metaLabel}>Tipo: </Text>
                    {r.tipo || "—"}
                    {r.conteudo.classificacaoRisco
                      ? `   |   Risco: ${r.conteudo.classificacaoRisco}`
                      : ""}
                    {r.profissional?.cboDescricao ? `   |   ${r.profissional.cboDescricao}` : ""}
                  </Text>
                  {linhasConteudo(r.conteudo).map((l, li) => (
                    <Text key={li} style={styles.conteudo}>
                      {l.label ? <Text style={styles.metaLabel}>{l.label}: </Text> : null}
                      {l.texto}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          ))
        )}

        {/* Rodapé fixo */}
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
  headerContainer: {
    position: "absolute",
    top: 16,
    left: 32,
    right: 32,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 60,
    height: 24,
    objectFit: "contain",
  },
  headerTextBlock: {
    flex: 1,
    alignItems: "center",
  },
  headerLine1: { fontSize: 11, fontFamily: "Helvetica-Bold" },
  headerLine2: { fontSize: 9 },
  headerLine3: { fontSize: 9 },
  headerDivider: {
    marginTop: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "#999",
  },
  title: {
    marginTop: 6,
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
  },
  box: {
    borderWidth: 0.5,
    borderColor: "#aaa",
    backgroundColor: "#f5f7fa",
    borderRadius: 3,
    padding: 8,
    marginBottom: 10,
  },
  boxTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    marginBottom: 4,
    gap: 6,
  },
  field: {
    flexDirection: "row",
    paddingRight: 6,
  },
  fieldLabel: {
    fontFamily: "Helvetica-Bold",
    marginRight: 3,
  },
  fieldValue: {
    flexShrink: 1,
  },
  atendimento: {
    borderWidth: 0.5,
    borderColor: "#bbb",
    borderRadius: 3,
    marginBottom: 10,
  },
  atendimentoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#dde6f0",
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  atendimentoTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9.5,
  },
  atendimentoSub: {
    fontSize: 8,
    color: "#444",
    marginTop: 1,
  },
  atendimentoDate: {
    fontSize: 8,
  },
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
  registroProf: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    flex: 1,
    paddingRight: 6,
  },
  registroDate: {
    fontSize: 8,
  },
  registroMeta: {
    fontSize: 8,
    marginBottom: 3,
    color: "#333",
  },
  metaLabel: {
    fontFamily: "Helvetica-Bold",
  },
  conteudo: {
    fontSize: 8.5,
    lineHeight: 1.4,
    textAlign: "justify",
    marginTop: 2,
  },
  emptyText: {
    fontSize: 9,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 20,
  },
  footer: {
    position: "absolute",
    bottom: 16,
    left: 32,
    right: 32,
  },
  footerDivider: {
    borderTopWidth: 0.5,
    borderTopColor: "#999",
    marginBottom: 4,
  },
  footerText: {
    fontSize: 7,
    color: "#666",
    textAlign: "center",
  },
  footerTextBold: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
  },
  pageNumber: {
    position: "absolute",
    right: 0,
    bottom: 0,
    fontSize: 7,
    color: "#666",
  },
});

export default ProntuarioPDF;
