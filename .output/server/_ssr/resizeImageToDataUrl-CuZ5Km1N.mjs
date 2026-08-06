//#region node_modules/.nitro/vite/services/ssr/assets/resizeImageToDataUrl-CuZ5Km1N.js
/**
* Redimensionne une image choisie sur l'appareil (fichier) en un carré
* recadré au centre, encodé en data URL JPEG — pour rester léger dans
* localStorage (photo de profil, avatar du classement).
*/
function resizeImageToDataUrl(file, size = 256) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onerror = () => reject(reader.error ?? /* @__PURE__ */ new Error("Lecture du fichier impossible"));
		reader.onload = () => {
			const img = new Image();
			img.onerror = () => reject(/* @__PURE__ */ new Error("Image invalide"));
			img.onload = () => {
				const side = Math.min(img.width, img.height);
				const sx = (img.width - side) / 2;
				const sy = (img.height - side) / 2;
				const canvas = document.createElement("canvas");
				canvas.width = size;
				canvas.height = size;
				const ctx = canvas.getContext("2d");
				if (!ctx) {
					reject(/* @__PURE__ */ new Error("Contexte canvas indisponible"));
					return;
				}
				ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);
				resolve(canvas.toDataURL("image/jpeg", .85));
			};
			img.src = reader.result;
		};
		reader.readAsDataURL(file);
	});
}
//#endregion
export { resizeImageToDataUrl as t };
