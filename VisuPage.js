///////////////////////////////////////////////////MAJ MODE SOMBRE / CLAIR//////////////////////////
//Stockage choix mode sombre / claire
let ModeAffich = localStorage.getItem("ModeAffich")
	? parseInt(localStorage.getItem("ModeAffich"))
	: 0;

//Action changement "choix mode sombre / clair"
export function ChgmtModeSombreClaire() {
	if (ModeAffich === 1) {
		ModeAffich = 2;
	} else {
		ModeAffich = 1;
	}

	localStorage.setItem("ModeAffich", ModeAffich);
	AffModeSombreClaire();
};


//MAJ Couleur Page + texte sur choix mode sombre ou clair
export function AffModeSombreClaire() {
	if (ModeAffich === 1) {
		document.getElementById("Bp_ChoixModeAff").textContent = "Mode Sombre";
		document.documentElement.style.setProperty('--backcolor', "white");
		document.documentElement.style.setProperty('--textcolor', "black");

	} else {
		document.getElementById("Bp_ChoixModeAff").textContent = "Mode Clair";
		document.documentElement.style.setProperty('--backcolor', '#111');
		document.documentElement.style.setProperty('--textcolor', '#eee');
	}

		
};