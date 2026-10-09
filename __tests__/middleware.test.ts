import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "../middleware";

function pedido(url: string, cookie?: string) {
  const headers = new Headers({ host: new URL(url).host });
  if (cookie) headers.set("cookie", cookie);
  return new NextRequest(url, { headers });
}

const SESION = "better-auth.session_token=abc";

// La app se mudo a un dominio propio, pero el deploy de Vercel sigue vivo con
// el mismo codigo. Quien entra por el link viejo tiene que ver el aviso de
// mudanza en vez de la app.
describe("middleware en el dominio viejo de Vercel", () => {
  it("muestra el aviso de mudanza en cualquier pagina", () => {
    const res = middleware(pedido("https://pomodoro-xyz.vercel.app/", SESION));

    expect(res.headers.get("x-middleware-rewrite")).toBe(
      "https://pomodoro-xyz.vercel.app/mudanza",
    );
  });

  it("muestra el aviso aunque no haya sesion, en vez de mandar al login", () => {
    const res = middleware(pedido("https://pomodoro-xyz.vercel.app/login"));

    expect(res.headers.get("x-middleware-rewrite")).toBe(
      "https://pomodoro-xyz.vercel.app/mudanza",
    );
    expect(res.headers.get("location")).toBeNull();
  });

  // Una PWA instalada desde el link viejo puede tener sesiones en la cola
  // offline, que solo da por entregado un 201 o 409: cortarle la API la deja
  // reintentando para siempre.
  it("deja pasar la API para no trabar la cola offline", () => {
    const res = middleware(
      pedido("https://pomodoro-xyz.vercel.app/api/sessions", SESION),
    );

    expect(res.headers.get("x-middleware-rewrite")).toBeNull();
  });
});

describe("middleware en el dominio propio", () => {
  it("no muestra el aviso de mudanza", () => {
    const res = middleware(
      pedido("https://pomodoro.alexandervilla.dev/", SESION),
    );

    expect(res.headers.get("x-middleware-rewrite")).toBeNull();
  });

  it("sigue mandando al login sin sesion", () => {
    const res = middleware(pedido("https://pomodoro.alexandervilla.dev/"));

    expect(res.headers.get("location")).toBe(
      "https://pomodoro.alexandervilla.dev/login",
    );
  });
});
