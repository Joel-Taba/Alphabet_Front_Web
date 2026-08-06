//#region node_modules/.nitro/vite/services/ssr/assets/profileAuth-wAmuDTHN.js
/**
* Protection très légère de la page Mon Profil par un mot de passe local
* (défini à l'inscription, modifiable depuis Mon Profil). Il n'y a pas de
* serveur dans cette application : le mot de passe est simplement stocké
* dans le navigateur pour empêcher un accès "en passant", pas pour résister
* à une attaque réelle.
*/
var PROFILE_NAME_KEY = "amani_profile_name";
var PROFILE_PASSWORD_KEY = "amani_profile_password";
var PROFILE_PHOTO_KEY = "amani_profile_photo";
var UNLOCK_SESSION_KEY = "amani_profile_unlocked";
function getStoredName() {
	if (typeof localStorage === "undefined") return "";
	return localStorage.getItem("amani_profile_name") ?? "";
}
function setStoredName(name) {
	if (typeof localStorage !== "undefined") localStorage.setItem(PROFILE_NAME_KEY, name);
}
/** Photo de profil choisie sur l'appareil, stockée en data URL (déjà redimensionnée/compressée). */
function getStoredPhoto() {
	if (typeof localStorage === "undefined") return null;
	return localStorage.getItem(PROFILE_PHOTO_KEY);
}
function setStoredPhoto(dataUrl) {
	if (typeof localStorage !== "undefined") localStorage.setItem(PROFILE_PHOTO_KEY, dataUrl);
}
function removeStoredPhoto() {
	if (typeof localStorage !== "undefined") localStorage.removeItem(PROFILE_PHOTO_KEY);
}
function getStoredPassword() {
	if (typeof localStorage === "undefined") return null;
	return localStorage.getItem(PROFILE_PASSWORD_KEY);
}
function setStoredPassword(password) {
	if (typeof localStorage !== "undefined") localStorage.setItem(PROFILE_PASSWORD_KEY, password);
}
/** La page Mon Profil n'est protégée que si un mot de passe a effectivement été défini. */
function isProfileProtected() {
	const pwd = getStoredPassword();
	return !!pwd && pwd.length > 0;
}
function isProfileUnlockedThisSession() {
	if (typeof sessionStorage === "undefined") return false;
	return sessionStorage.getItem(UNLOCK_SESSION_KEY) === "true";
}
function markProfileUnlocked() {
	if (typeof sessionStorage !== "undefined") sessionStorage.setItem(UNLOCK_SESSION_KEY, "true");
}
function lockProfile() {
	if (typeof sessionStorage !== "undefined") sessionStorage.removeItem(UNLOCK_SESSION_KEY);
}
//#endregion
export { isProfileUnlockedThisSession as a, removeStoredPhoto as c, setStoredPhoto as d, isProfileProtected as i, setStoredName as l, getStoredPassword as n, lockProfile as o, getStoredPhoto as r, markProfileUnlocked as s, getStoredName as t, setStoredPassword as u };
