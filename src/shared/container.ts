import { ListarArquivoRaasConsumer } from "@/features/raas/consumer/ListarArquivoRaasConsumer";
import type { ListarArquivoRaasPort } from "@/features/raas/port/ListarArquivoRaasPort";
import { PacientePersistenceAdapter } from "@/features/paciente/api/PacientePersistenceAdapter";
import type { PacientePort } from "@/features/paciente/port/PacientePort";
import { VacinaPersistenceAdapter } from "@/features/vacina/api/VacinaPersistenceAdapter";
import type { VacinaPort } from "@/features/vacina/port/VacinaPort";
import { ProntuarioPersistenceAdapter } from "@/features/prontuario/api/ProntuarioPersistenceAdapter";
import type { ProntuarioPort } from "@/features/prontuario/port/ProntuarioPort";
import { DownloadArquivoRaasPort } from "@/features/raas/port/DownloadArquivoRaasPort";
import { DownloadArquivoRaasConsumer } from "@/features/raas/consumer/DownloadArquivoRaasConsumer";
import { ListarUnidadesPort } from "@/features/raas/port/ListarUnidadesPort";
import { ListarUnidadesConsumer } from "@/features/raas/consumer/ListarUnidadesConsumer";

export const downloadArquivoRaasPort: DownloadArquivoRaasPort = new DownloadArquivoRaasConsumer();
export const listarArquivosRaasPort: ListarArquivoRaasPort = new ListarArquivoRaasConsumer();
export const listarUnidadesRaasPort: ListarUnidadesPort = new ListarUnidadesConsumer();
export const pacienteRepository: PacientePort = new PacientePersistenceAdapter();
export const vacinaRepository: VacinaPort = new VacinaPersistenceAdapter();
export const prontuarioRepository: ProntuarioPort = new ProntuarioPersistenceAdapter();
