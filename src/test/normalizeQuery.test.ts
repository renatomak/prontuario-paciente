// src/test/normalizeQuery.test.ts
import { normalizeQuery, isCpfQuery } from "../domain/utils/normalizeQuery";
import { describe, it, expect } from "vitest";

describe("normalizeQuery", () => {
  it("remove caracteres especiais e deixa maiúsculo", () => {
    expect(normalizeQuery("Alexandre Silva")).toBe("ALEXANDRESILVA");
    expect(normalizeQuery("123.456-789 01")).toBe("12345678901");
  });
});

describe("isCpfQuery", () => {
  it("detecta CPF válido (11 dígitos)", () => {
    expect(isCpfQuery("123.456.789-01")).toBe(true);
    expect(isCpfQuery("12345678901")).toBe(true);
    expect(isCpfQuery("Alexandre Silva")).toBe(false);
    expect(isCpfQuery("1234567890")).toBe(false);
  });
});
