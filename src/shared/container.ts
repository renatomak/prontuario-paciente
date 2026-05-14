import {
  ListarArquivoRaasConsumer,
  ListarUnidadesConsumer,
  DownloadArquivoRaasConsumer,
} from "@/features/raas";
import type {
  ListarArquivoRaasPort,
  ListarUnidadesPort,
  DownloadArquivoRaasPort,
} from "@/features/raas";
import { PacientePersistenceAdapter } from "@/features/paciente/api/PacientePersistenceAdapter";
import type { PacientePort } from "@/features/paciente/port/PacientePort";
import { VacinaPersistenceAdapter } from "@/features/vacina/api/VacinaPersistenceAdapter";
import type { VacinaPort } from "@/features/vacina/port/VacinaPort";
import { ProntuarioPersistenceAdapter } from "@/features/prontuario/api/ProntuarioPersistenceAdapter";
import type { ProntuarioPort } from "@/features/prontuario/port/ProntuarioPort";

export const downloadArquivoRaasPort: DownloadArquivoRaasPort = new DownloadArquivoRaasConsumer();
export const listarArquivosRaasPort: ListarArquivoRaasPort = new ListarArquivoRaasConsumer();
export const listarUnidadesRaasPort: ListarUnidadesPort = new ListarUnidadesConsumer();
export const pacienteRepository: PacientePort = new PacientePersistenceAdapter();
export const vacinaRepository: VacinaPort = new VacinaPersistenceAdapter();
export const prontuarioRepository: ProntuarioPort = new ProntuarioPersistenceAdapter();
