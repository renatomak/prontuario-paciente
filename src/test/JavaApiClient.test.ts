import { describe, it, expect, vi, type Mock } from "vitest";
import { JavaApiClient } from "../adapters/java-api/JavaApiClient";
import { ApiErrorImpl } from "../shared/http";

global.fetch = vi.fn() as unknown as typeof fetch;

describe("JavaApiClient", () => {
  it("parseia resposta JSON com sucesso", async () => {
    (fetch as unknown as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ok: 1 }),
    });
    const client = new JavaApiClient();
    const data = await client.get<unknown>("/test");
    expect(data).toEqual({ ok: 1 });
  });

  it("lança ApiErrorImpl com mensagem customizada do backend", async () => {
    (fetch as unknown as jest.Mock).mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ message: "Erro customizado" }),
      headers: { get: () => "application/json" }
    });
    const client = new JavaApiClient();
    await expect(client.get<unknown>("/fail")).rejects.toThrow(ApiErrorImpl);
    (fetch as unknown as jest.Mock).mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ message: "Erro customizado" }),
      headers: { get: () => "application/json" }
    });
    await expect(client.get<unknown>("/fail")).rejects.toThrow("Erro customizado");
  });

  it("lança ApiErrorImpl com mensagem padrão se backend não retorna message", async () => {
    (fetch as unknown as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
      headers: { get: () => "application/json" }
    });
    const client = new JavaApiClient();
    await expect(client.get<unknown>("/fail2")).rejects.toThrow(ApiErrorImpl);
    (fetch as unknown as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
      headers: { get: () => "application/json" }
    });
    await expect(client.get<unknown>("/fail2")).rejects.toThrow("Erro HTTP 500");
  });
});
