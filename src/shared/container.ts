/**
 * Container de injeção de dependências.
 *
 * Os hooks (camada de Application) importam daqui as instâncias
 * concretas dos adapters. Em testes, substituímos via parâmetro
 * opcional `repository?` exposto em cada hook.
 */
import { RaasPersistenceAdapter } from "@/features/raas/api/RaasPersistenceAdapter";
import type { RaasRepository } from "@/features/raas/domain/RaasRepository";

export const raasRepository: RaasRepository = new RaasPersistenceAdapter();
