///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Déclaration variable
const ChoixModeAff = document.getElementById("Bp_ChoixModeAff");
const AddCig = document.getElementById("Bp_AddCig");
const Cpt_CigJour = document.getElementById("Cpt_CigJour");
const Bp_TestChgmtJour = document.getElementById("Bp_TestChgmtJour");
const Bp_TestLoadBDD = document.getElementById("TestChargementBdd");

//Liaison fonction
import { ChgmtModeSombreClaire, AffModeSombreClaire } from './VisuPage.js';
import { ReadataInGoogleSheets, SaveDataInGoogleSheets } from './GestBdd.js';


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Action Page Refresh
document.addEventListener("DOMContentLoaded", async () => {
    //Affichage Mode Sombre ou Claire
    AffModeSombreClaire();

    //Chargement data depuis Bdd google sheets
    if (!sessionStorage.getItem("FrtmPageLoaded")) {
    console.log("Loading CptCigJour From BDD IN PROGRESS");

    const DataRead = await ReadataInGoogleSheets() || [];
    
    if (DataRead[1] != undefined) {

    //Compteur Cig////////////////////////////////////////////////
    const NbrCigJour = DataRead[2][0];

    if (NbrCigJour != undefined) {
    localStorage.setItem("NbrCigJour", parseInt(NbrCigJour));
    sessionStorage.setItem("FrtmPageLoaded", "true");

    console.log("Loading BDD OK | ", parseInt(NbrCigJour));
    } else {
        console.log("Loading BDD FAILLED - Ligne Undefined");
    };

   //Chargement data depuis Bdd google sheets >>> Index Cig
    const IndexCigJour = DataRead[4][0];
    localStorage.setItem("IndexCig", IndexCigJour);
    };

    //MAJ Visu Comtpeur Cpt cig Jour
    Cpt_CigJour.textContent =  parseInt(localStorage.getItem("NbrCigJour"));;
    

});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Action Bouton Changement Mode Sombre/Claire
ChoixModeAff.addEventListener("click", ChgmtModeSombreClaire);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Action Bouton Incrementation Compteur cig Jour
AddCig.addEventListener("click", async() => {  
const now = new Date();
const dateActuelJour = now.getDate().toString().padStart(2, '0');
const dateActuelMois = (now.getMonth()+1).toString().padStart(2, '0');
const dateActuelAnnee = now.getFullYear().toString();
const dateActuelheure = now.getHours().toString().padStart(2, '0');
const dateActuelMinute = now.getMinutes().toString().padStart(2, '0');
const dateActuelSeconde= now.getSeconds().toString().padStart(2, '0');

const dateComplete = `${dateActuelJour}/${dateActuelMois}/${dateActuelAnnee} ${dateActuelheure}:${dateActuelMinute}:${dateActuelSeconde}`;

    //Bloquage bouton pendant envoie données
    AddCig.disabled = true,
    AddCig.textContent = "Envoie en cours"

    //Loading Local Data
    let NbrCigJourActu = parseInt(localStorage.getItem("NbrCigJour")) || 0;
    let index = parseInt(localStorage.getItem("IndexCig")) || 6;

    //Incrementation Compteur et index
 	NbrCigJourActu++;
    index++;

    if (index < 7) {
        index = 7;
    };

    //Maj visu compteur
    Cpt_CigJour.textContent = NbrCigJourActu;

    //Création Ligne Cig dans Bdd google sheets

    localStorage.setItem("IndexCig", index);
;
    SaveDataInGoogleSheets("write", `A${index}`, (index-6));
    SaveDataInGoogleSheets("write", `B${index}`, dateComplete)
    SaveDataInGoogleSheets("write", "A5", index)
	await SaveDataInGoogleSheets("write", "A3", NbrCigJourActu);

    //Réactivation bouton
    AddCig.disabled = false,
    AddCig.textContent = "Ajouter"

    //Enregistrement local cptCigjour
	localStorage.setItem("NbrCigJour", NbrCigJourActu);
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Action Bouton Changement de jour
Bp_TestChgmtJour.addEventListener("click", () => {
    console.log("LocalEssaie", NbrCigJourActu);
    
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Action Bp Test chargement bdd
Bp_TestLoadBDD.addEventListener("click", () => {
    sessionStorage.removeItem("FrtmPageLoaded")
    
});