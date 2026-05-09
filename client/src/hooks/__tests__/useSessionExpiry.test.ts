import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useSessionExpiry } from "../useSessionExpiry";

const mockLogout = vi.fn();
const mockNavigate = vi.fn();

vi.mock("@/features/auth/store/authStore", () => ({
  useAuthStore: () => ({ logout: mockLogout }),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("sonner", () => ({
  toast: { error: vi.fn() },
}));

const SESSION_TIMEOUT = 10 * 60 * 1000;
const WARNING_BEFORE = 1 * 60 * 1000;

describe("useSessionExpiry", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockLogout.mockClear();
    mockNavigate.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("showWarning is false initially", () => {
    const { result } = renderHook(() => useSessionExpiry());
    expect(result.current.showWarning).toBe(false);
  });

  it("shows warning after SESSION_TIMEOUT - WARNING_BEFORE", () => {
    const { result } = renderHook(() => useSessionExpiry());

    act(() => {
      vi.advanceTimersByTime(SESSION_TIMEOUT - WARNING_BEFORE);
    });

    expect(result.current.showWarning).toBe(true);
  });

  it("secondsLeft counts down after warning appears", () => {
    const { result } = renderHook(() => useSessionExpiry());

    act(() => {
      vi.advanceTimersByTime(SESSION_TIMEOUT - WARNING_BEFORE);
    });

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.secondsLeft).toBeLessThan(WARNING_BEFORE / 1000);
  });

  it("calls logout and navigate after SESSION_TIMEOUT", () => {
    renderHook(() => useSessionExpiry());

    act(() => {
      vi.advanceTimersByTime(SESSION_TIMEOUT);
    });

    expect(mockLogout).toHaveBeenCalledOnce();
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("resets warning on activity", () => {
    const { result } = renderHook(() => useSessionExpiry());

    act(() => {
      vi.advanceTimersByTime(SESSION_TIMEOUT - WARNING_BEFORE);
    });

    expect(result.current.showWarning).toBe(true);

    act(() => {
      window.dispatchEvent(new Event("click"));
    });

    expect(result.current.showWarning).toBe(false);
  });
});
