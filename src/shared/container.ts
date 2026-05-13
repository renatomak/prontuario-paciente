import { RaasPersistenceAdapter } from "@/features/raas/api/RaasPersistenceAdapter";
import type { RaasPort } from "@/features/raas/port/RaasPort";
import { PacientePersistenceAdapter } from "@/features/paciente/api/PacientePersistenceAdapter";
import type { PacientePort } from "@/features/paciente/port/PacientePort";
import { VacinaPersistenceAdapter } from "@/features/vacina/api/VacinaPersistenceAdapter";
import type { VacinaPort } from "@/features/vacina/port/VacinaPort";
import { ProntuarioPersistenceAdapter } from "@/features/prontuario/api/ProntuarioPersistenceAdapter";
import type { ProntuarioPort } from "@/features/prontuario/port/ProntuarioPort";
import { DownloadArquivoRaasPort } from "@/features/raas/port/DownloadArquivoRaasPort";
import { DownloadArquivoRaasConsumer } from "@/features/raas/api/DownloadArquivoRaasConsumer";

export const downloadArquivoRaasPort: DownloadArquivoRaasPort = new DownloadArquivoRaasConsumer();
export const raasRepository: RaasPort = new RaasPersistenceAdapter();
export const pacienteRepository: PacientePort = new PacientePersistenceAdapter();
export const vacinaRepository: VacinaPort = new VacinaPersistenceAdapter();
export const prontuarioRepository: ProntuarioPort = new ProntuarioPersistenceAdapter();
