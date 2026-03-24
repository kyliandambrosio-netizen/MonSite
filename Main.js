///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Déclaration variable
const ChoixModeAff = document.getElementById("Bp_ChoixModeAff");
const AddCig = document.getElementById("Bp_AddCig");
const Cpt_CigJour = document.getElementById("Cpt_CigJour");
const Bp_TestChgmtJour = document.getElementById("Bp_TestChgmtJour");
const Bp_TestLoadBDD = document.getElementById("TestChargementBdd");
const dateActuel = Date();


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
    localStorage.setItem("NbrCigJour", parseInt(DataRead[1][1]));
    sessionStorage.setItem("FrtmPageLoaded", "true");

    console.log("Loading CptCigJour From BDD OK | ", parseInt(DataRead[1][1]));
    } else {
        console.log("Loading CptCigJour From BDD FAILLED - Ligne Undefined");
    };
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
    //Bloquage bouton pendant envoie données
    AddCig.disabled = true,
    AddCig.textContent = "Envoie en cours"

    //Loading Local Data
    let NbrCigJourActu = parseInt(localStorage.getItem("NbrCigJour"));

    //Incrementation Compteur
 	NbrCigJourActu++;
    //Maj visu compteur
    Cpt_CigJour.textContent = NbrCigJourActu;


    //Envoie BDD Google Sheets
	const valeurRetour = await SaveDataInGoogleSheets("write", "B2", NbrCigJourActu);

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