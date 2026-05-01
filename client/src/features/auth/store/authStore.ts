interface AuthState {
  user: { id: string; name: string } | null;
  setUser: (user: AuthState["user"]) => void;
  logout: () => void;
}
