/**
 * Container de injeção de dependências.
 *
 * Os hooks (camada de Application) importam daqui as instâncias
 * concretas dos adapters. Em testes, substituímos via parâmetro
 * opcional `repository?` exposto em cada hook.
 */
import { RaasPersistenceAdapter } from "@/features/raas/api/RaasPersistenceAdapter";
import type { RaasRepository } from "@/features/raas/domain/RaasRepository";
import { PacientePersistenceAdapter } from "@/features/paciente/api/PacientePersistenceAdapter";
import type { PacienteRepository } from "@/features/paciente/domain/PacienteRepository";
import { VacinaPersistenceAdapter } from "@/features/vacina/api/VacinaPersistenceAdapter";
import type { VacinaRepository } from "@/features/vacina/domain/VacinaRepository";
import { ProntuarioPersistenceAdapter } from "@/features/prontuario/api/ProntuarioPersistenceAdapter";
import type { ProntuarioRepository } from "@/features/prontuario/domain/ProntuarioRepository";

export const raasRepository: RaasRepository = new RaasPersistenceAdapter();
export const pacienteRepository: PacienteRepository = new PacientePersistenceAdapter();
export const vacinaRepository: VacinaRepository = new VacinaPersistenceAdapter();
export const prontuarioRepository: ProntuarioRepository = new ProntuarioPersistenceAdapter();
