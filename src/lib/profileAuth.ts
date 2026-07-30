/**
 * Protection très légère de la page Mon Profil par un mot de passe local
 * (défini à l'inscription, modifiable depuis Mon Profil). Il n'y a pas de
 * serveur dans cette application : le mot de passe est simplement stocké
 * dans le navigateur pour empêcher un accès "en passant", pas pour résister
 * à une attaque réelle.
 */

export const PROFILE_NAME_KEY = "amani_profile_name";
export const PROFILE_PASSWORD_KEY = "amani_profile_password";
const UNLOCK_SESSION_KEY = "amani_profile_unlocked";

export function getStoredName(): string {
  if (typeof localStorage === "undefined") return "";
  return localStorage.getItem(PROFILE_NAME_KEY) ?? "";
}

export function setStoredName(name: string) {
  if (typeof localStorage !== "undefined") localStorage.setItem(PROFILE_NAME_KEY, name);
}

export function getStoredPassword(): string | null {
  if (typeof localStorage === "undefined") return null;
  return localStorage.getItem(PROFILE_PASSWORD_KEY);
}

export function setStoredPassword(password: string) {
  if (typeof localStorage !== "undefined") localStorage.setItem(PROFILE_PASSWORD_KEY, password);
}

/** La page Mon Profil n'est protégée que si un mot de passe a effectivement été défini. */
export function isProfileProtected(): boolean {
  const pwd = getStoredPassword();
  return !!pwd && pwd.length > 0;
}

export function isProfileUnlockedThisSession(): boolean {
  if (typeof sessionStorage === "undefined") return false;
  return sessionStorage.getItem(UNLOCK_SESSION_KEY) === "true";
}

export function markProfileUnlocked() {
  if (typeof sessionStorage !== "undefined") sessionStorage.setItem(UNLOCK_SESSION_KEY, "true");
}

export function lockProfile() {
  if (typeof sessionStorage !== "undefined") sessionStorage.removeItem(UNLOCK_SESSION_KEY);
}
