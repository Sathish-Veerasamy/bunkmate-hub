export type AuthStage =
  | 'ORG_REQUIRED'
  | 'TENANT_SELECTION_REQUIRED'
  | 'AUTHENTICATED';

export interface AuthState {
  token: string | null;
  user?: unknown;
  stage?: AuthStage;
}

const STORAGE_KEY = 'auth-storage';

export function setAuthState(state: AuthState) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ state })
  );
}

export function getAuthState(): AuthState | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw).state as AuthState;
  } catch {
    return null;
  }
}

export function clearAuthState() {
  localStorage.removeItem(STORAGE_KEY);
}
