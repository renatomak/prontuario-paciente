import { RaasPersistenceAdapter } from "@/features/raas/api/RaasPersistenceAdapter";
import type { RaasPort } from "@/features/raas/domain/RaasPort";
import { PacientePersistenceAdapter } from "@/features/paciente/api/PacientePersistenceAdapter";
import type { PacientePort } from "@/features/paciente/domain/PacientePort";
import { VacinaPersistenceAdapter } from "@/features/vacina/api/VacinaPersistenceAdapter";
import type { VacinaPort } from "@/features/vacina/domain/VacinaPort";
import { ProntuarioPersistenceAdapter } from "@/features/prontuario/api/ProntuarioPersistenceAdapter";
import type { ProntuarioPort } from "@/features/prontuario/domain/ProntuarioPort";

export const raasRepository: RaasPort = new RaasPersistenceAdapter();
export const pacienteRepository: PacientePort = new PacientePersistenceAdapter();
export const vacinaRepository: VacinaPort = new VacinaPersistenceAdapter();
export const prontuarioRepository: ProntuarioPort = new ProntuarioPersistenceAdapter();
