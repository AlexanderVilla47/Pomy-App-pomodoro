import { describe, it, expect, vi } from "vitest";

// Mismo truco que en session.test.ts: `betterAuth` se mockea para poder leer
// la configuración con la que se lo construye, sin levantar su runtime.
vi.mock("pg", () => ({ Pool: class {} }));
vi.mock("better-auth", () => ({
  betterAuth: vi.fn((options) => ({ options })),
}));

import { auth } from "@/lib/auth";

describe("proveedor de Google", () => {
  // Cerrar sesión en Pomodoro borra la cookie de Pomodoro, no la sesión de
  // Google en el navegador. Sin `prompt`, better-auth no manda el parámetro a
  // la URL de autorización y Google, al ver una única sesión viva, entra
  // derecho con ella sin preguntar. En mobile esa sesión es la cuenta del
  // dispositivo, así que cambiar de cuenta era imposible desde la app.
  it("pide siempre el selector de cuenta", () => {
    expect(auth.options.socialProviders?.google?.prompt).toBe("select_account");
  });
});
