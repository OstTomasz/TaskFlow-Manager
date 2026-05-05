import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { useTodoFilters } from "../useTodoFilters";
import { MOCK } from "./fixtures/todos";

describe("useTodoFilters", () => {
  let result: ReturnType<
    typeof renderHook<ReturnType<typeof useTodoFilters>, unknown>
  >["result"];

  beforeEach(() => {
    ({ result } = renderHook(() => useTodoFilters(MOCK)));
  });

  it("returns all todos when no filters active", () => {
    expect(result.current.filtered).toHaveLength(6);
  });

  it("returns 0 when todos is empty", () => {
    const { result } = renderHook(() => useTodoFilters([]));

    expect(result.current.filtered).toHaveLength(0);
  });

  it("filters by search (case-insensitive)", () => {
    act(() => {
      result.current.setSearch("drag");
    });

    expect(result.current.filtered).toHaveLength(1);
    expect(result.current.filtered[0].id).toBe(
      "1a2b3c4d-0000-0000-0000-000000000004",
    );
  });

  it("returns all with only whitespace search filter", () => {
    act(() => {
      result.current.setSearch("    ");
    });

    expect(result.current.filtered).toHaveLength(6);
  });

  it("returns 0 when no matches found", () => {
    act(() => {
      result.current.setSearch("Nonsense");
    });

    expect(result.current.filtered).toHaveLength(0);
  });

  it("filters by status", () => {
    act(() => {
      result.current.setStatusFilter(["todo"]);
    });

    expect(result.current.filtered).toHaveLength(2);
    expect(result.current.filtered[0].id).toBe(
      "1a2b3c4d-0000-0000-0000-000000000005",
    );
    expect(result.current.filtered[1].id).toBe(
      "1a2b3c4d-0000-0000-0000-000000000004",
    );
  });

  it("filters by priority", () => {
    act(() => {
      result.current.setPriorityFilter(["medium"]);
    });

    expect(result.current.filtered).toHaveLength(2);
    expect(result.current.filtered[0].id).toBe(
      "1a2b3c4d-0000-0000-0000-000000000006",
    );
    expect(result.current.filtered[1].id).toBe(
      "1a2b3c4d-0000-0000-0000-000000000005",
    );
  });

  it("filters by status and priority", () => {
    act(() => {
      result.current.setStatusFilter(["todo"]);
      result.current.setPriorityFilter(["low"]);
    });

    expect(result.current.filtered).toHaveLength(1);
    expect(result.current.filtered[0].id).toBe(
      "1a2b3c4d-0000-0000-0000-000000000004",
    );
  });

  it("return all afrer status filter change to none", () => {
    act(() => {
      result.current.setStatusFilter(["todo"]);
      result.current.setStatusFilter([]);
    });

    expect(result.current.filtered).toHaveLength(6);
  });

  it("sort by descending creation date", () => {
    act(() => {
      result.current.setSortBy("creationDate");
    });

    expect(result.current.filtered[0].id).toBe(
      "1a2b3c4d-0000-0000-0000-000000000006",
    );
  });

  it("sort by descending status → todo first, done last", () => {
    act(() => {
      result.current.setSortBy("status");
    });

    expect(result.current.filtered[0].status).toBe("todo");
    expect(result.current.filtered.at(-1)?.status).toBe("done");
  });

  it("sort by descending priority", () => {
    act(() => {
      result.current.setSortBy("priority");
    });

    expect(result.current.filtered[0].status).toBe("done");
    expect(result.current.filtered[0].id).toBe(
      "1a2b3c4d-0000-0000-0000-000000000001",
    );
    expect(result.current.filtered[1].id).toBe(
      "1a2b3c4d-0000-0000-0000-000000000002",
    );

    expect(result.current.filtered.at(-1)?.status).toBe("todo");
  });

  it("sort by ascending priority", () => {
    act(() => {
      result.current.setSortBy("priority");
      result.current.setSortOrder("asc");
    });

    expect(result.current.filtered[0].id).toBe(
      "1a2b3c4d-0000-0000-0000-000000000004",
    );
    expect(result.current.filtered.at(-1)?.id).toBe(
      "1a2b3c4d-0000-0000-0000-000000000001",
    );
  });
});
