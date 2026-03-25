///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Déclaration variable
const ChoixModeAff = document.getElementById("Bp_ChoixModeAff");
const AddCig = document.getElementById("Bp_AddCig");
const Cpt_CigJour = document.getElementById("Cpt_CigJour");
const Bp_TestChgmtJour = document.getElementById("Bp_TestChgmtJour");
const Bp_TestLoadBDD = document.getElementById("TestChargementBdd");
const now = new Date();
const dateActuelJour = now.getDate().toString().padStart(2, '0');
const dateActuelMois = (now.getMonth()+1).toString().padStart(2, '0');
const dateActuelAnnee = now.getFullYear().toString();
const dateActuelheure = now.getHours().toString().padStart(2, '0');
const dateActuelMinute = now.getMinutes().toString().padStart(2, '0');
const dateActuelSeconde= now.getSeconds().toString().padStart(2, '0');

const dateComplete = `${dateActuelJour}/${dateActuelMois}/${dateActuelAnnee} ${dateActuelheure}:${dateActuelMinute}:${dateActuelSeconde}`;
//Liaison fonction
import { ChgmtModeSombreClaire, AffModeSombreClaire } from './VisuPage.js';
import { ReadataInGoogleSheets, WriteOneCellInGoogleSheets, WriteRangeInGoogleSheets } from './GestBdd.js';


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Action Page Refresh
document.addEventListener("DOMContentLoaded", async () => {
    //Affichage Mode Sombre ou Claire
    AffModeSombreClaire();

    //Chargement data depuis Bdd google sheets
    if (!sessionStorage.getItem("FrtmPageLoaded")) {
    console.log("Loading BDD IN PROGRESS");

    const DataRead = await ReadataInGoogleSheets() || [];

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

    //Bloquage bouton pendant envoie données
    AddCig.disabled = true,
    AddCig.textContent = "Envoie en cours"

    //Loading Local Data
    let NbrCigJourActu = parseInt(localStorage.getItem("NbrCigJour")) || 0;

    //Incrementation Compteur et index
 	NbrCigJourActu++;

    //Maj visu compteur
    Cpt_CigJour.textContent = NbrCigJourActu;

    //Enregistrement local cptCigjour
	localStorage.setItem("NbrCigJour", NbrCigJourActu);

    WriteRangeInGoogleSheets("writeRange", `A${NbrCigJourActu+6}:B${NbrCigJourActu+6}`, [NbrCigJourActu, dateComplete]);
	await WriteOneCellInGoogleSheets("write", "A3", NbrCigJourActu);

    //Réactivation bouton
    AddCig.disabled = false,
    AddCig.textContent = "Ajouter"

});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Action Bouton Changement de jour
Bp_TestChgmtJour.addEventListener("click", async() => {
    const MemNbrCigJour = localStorage.getItem("NbrCigJour");
    const now = new Date();
    const IndexMemJour = parseInt(dateActuelJour)+2;

    //création ligne mémorisation Jour
    await WriteRangeInGoogleSheets("writeRange", `I${IndexMemJour}:J${IndexMemJour}`, [dateComplete, MemNbrCigJour]);

    //Raz compteur cig local
    localStorage.setItem("NbrCigJour", 0)
    Cpt_CigJour.textContent = 0;

    //Raz Zone mémoire google sheet Cig jour 
    WriteOneCellInGoogleSheets("write", "A3", 0)
    WriteOneCellInGoogleSheets("write", "A5", 0)
    await WriteRangeInGoogleSheets("razRange", "A7:B200", 0);

    
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Action Bp Test chargement bdd
Bp_TestLoadBDD.addEventListener("click", () => {
    sessionStorage.removeItem("FrtmPageLoaded")
    
});