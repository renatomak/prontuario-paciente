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
import { BuscarPacienteConsumer } from "@/features/paciente/consumer/BuscarPacienteConsumer";
import { CarregarPacienteConsumer } from "@/features/paciente/consumer/CarregarPacienteConsumer";
import type { BuscarPacientePort } from "@/features/paciente/port/BuscarPacientePort";
import type { CarregarPacientePort } from "@/features/paciente/port/CarregarPacientePort";
import {
  ListarVacinasConsumer,
  ObterVacinaDetalheConsumer,
} from "@/features/vacina";
import type { ListarVacinasPort, ObterVacinaDetalhePort } from "@/features/vacina";
import { ObterProntuarioConsumer } from "@/features/prontuario/consumer/ObterProntuarioConsumer";
import type { ObterProntuarioPort } from "@/features/prontuario/port/ObterProntuarioPort";

export const downloadArquivoRaasPort: DownloadArquivoRaasPort = new DownloadArquivoRaasConsumer();
export const listarArquivosRaasPort: ListarArquivoRaasPort = new ListarArquivoRaasConsumer();
export const listarUnidadesRaasPort: ListarUnidadesPort = new ListarUnidadesConsumer();

export const buscarPacientePort: BuscarPacientePort = new BuscarPacienteConsumer();
export const carregarPacientePort: CarregarPacientePort = new CarregarPacienteConsumer();

export const listarVacinasPort: ListarVacinasPort = new ListarVacinasConsumer();
export const obterVacinaDetalhePort: ObterVacinaDetalhePort = new ObterVacinaDetalheConsumer();

export const obterProntuarioPort: ObterProntuarioPort = new ObterProntuarioConsumer();
