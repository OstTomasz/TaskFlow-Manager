// client/src/test/setup.ts — dopisz na górze
import { vi, beforeAll, afterAll, afterEach } from "vitest";
import { server } from "./server";

// Zapobiega błędowi getState w axios interceptorze
vi.mock("@/lib/axios", async () => {
  const { default: axios } = await import("axios");
  return {
    api: axios.create({
      baseURL: "http://localhost:5001/api",
    }),
  };
});

beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
