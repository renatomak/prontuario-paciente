// src/ui/hooks/useVacinaDetalhe.ts
import { useQuery } from "@tanstack/react-query";
import { getVacinaDetalhe } from "../../application/vacina";
import { JavaApiVacinaAdapter } from "../../adapters/java-api/JavaApiVacinaAdapter";

const vacinaPort = new JavaApiVacinaAdapter();

export function useVacinaDetalhe(idAplicacao: number, enabled = true) {
  return useQuery({
    queryKey: ["vacinaDetalhe", idAplicacao],
    queryFn: () => getVacinaDetalhe(idAplicacao, vacinaPort),
    enabled: !!idAplicacao && enabled,
  });
}
