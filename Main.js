///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Déclaration variable
const ChoixModeAff = document.getElementById("Bp_ChoixModeAff");
const AddCig = document.getElementById("Bp_AddCig");
const Cpt_CigJour = document.getElementById("Cpt_CigJour");
const Bp_TestChgmtJour = document.getElementById("Bp_TestChgmtJour");
const Bp_TestLoadBDD = document.getElementById("TestChargementBdd");
const IntervalleCig = document.getElementById("IntervalleCig");

//Liaison fonction
import { ChgmtModeSombreClaire, AffModeSombreClaire } from './VisuPage.js';
import { ReadataInGoogleSheets, WriteOneCellInGoogleSheets, WriteRangeInGoogleSheets } from './GestBdd.js';


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Action Page Refresh
document.addEventListener("DOMContentLoaded", async () => {
    const now = new Date();
    const dateActuelJour = now.getDate().toString().padStart(2, '0');
    const dateActuelMois = (now.getMonth()+1).toString().padStart(2, '0');
    const dateActuelAnnee = now.getFullYear().toString();
    const dateActuelheure = now.getHours().toString().padStart(2, '0');
    const dateActuelMinute = now.getMinutes().toString().padStart(2, '0');
    const dateActuelSeconde= now.getSeconds().toString().padStart(2, '0');

    const dateComplete = `${dateActuelJour}/${dateActuelMois}/${dateActuelAnnee} ${dateActuelheure}:${dateActuelMinute}:${dateActuelSeconde}`;

    //Affichage Mode Sombre ou Claire
    AffModeSombreClaire();

    //Chargement data depuis Bdd google sheets/////////////////////////////////////////////
    if (!sessionStorage.getItem("FrtmPageLoaded")) {
        console.log("Loading BDD IN PROGRESS");

        const DataRead = await ReadataInGoogleSheets() || [];
        const NbrCigJour = DataRead[2][0] || 0; //Compteur Cig
        const LastJour = DataRead[1][7] || 0; //MemJour

        localStorage.setItem("DateCigJourSaved", parseInt(LastJour));
        localStorage.setItem("NbrCigJour", parseInt(NbrCigJour));
        sessionStorage.setItem("FrtmPageLoaded", "true");

        //Changement Jour///////////////////////////////////////////////////////////////////////

        if (LastJour  != dateActuelJour) {
        const MemNbrCigJour = localStorage.getItem("NbrCigJour");
        const IndexMemJour = parseInt(dateActuelJour)+2;

        //création ligne mémorisation Jour actu
        WriteOneCellInGoogleSheets("writeOnceCell", `I${IndexMemJour}`, dateComplete);

        //Memorisation nombre cig jour précédent
        WriteOneCellInGoogleSheets("writeOnceCEll", `J${LastJour+2}`, MemNbrCigJour);

        //Raz compteur cig local
        localStorage.setItem("NbrCigJour", 0)

        //Raz Zone mémoire google sheet Cig jour 
        WriteOneCellInGoogleSheets("write", "A3", 0)
        WriteOneCellInGoogleSheets("write", "A5", 0)
        await WriteRangeInGoogleSheets("razRange", "A7:B200", 0);

        //Mémorisation date
        localStorage.setItem("DateCigJourSaved", dateActuelJour);
        WriteOneCellInGoogleSheets("write", "H2", dateActuelJour)
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
    const DateActu = new Date();
    const dateActuelJour = DateActu.getDate().toString().padStart(2, '0');
    const dateActuelMois = (DateActu.getMonth()+1).toString().padStart(2, '0');
    const dateActuelAnnee = DateActu.getFullYear().toString();
    const dateActuelheure = DateActu.getHours().toString().padStart(2, '0');
    const dateActuelMinute = DateActu.getMinutes().toString().padStart(2, '0');
    const dateActuelSeconde= DateActu.getSeconds().toString().padStart(2, '0');

    const dateComplete = `${dateActuelJour}/${dateActuelMois}/${dateActuelAnnee} ${dateActuelheure}:${dateActuelMinute}:${dateActuelSeconde}`;

    //Bloquage bouton pendant envoie données
    AddCig.disabled = true,
    AddCig.textContent = "Envoie en cours"

    //Loading Local Data
    let NbrCigJourActu = parseInt(localStorage.getItem("NbrCigJour")) || 0;

    //Incrementation Compteur et index
 	NbrCigJourActu++;

    //Maj visu compteur
    Cpt_CigJour.textContent = NbrCigJourActu;

    //Mémorisation Date
    localStorage.setItem("MemDateLastCig", DateActu);

    //Enregistrement local cptCigjour
	localStorage.setItem("NbrCigJour", NbrCigJourActu);

    //Enregistremnt Google Sheets
    await Promise.all([
    WriteRangeInGoogleSheets("writeRange", `A${NbrCigJourActu+6}:B${NbrCigJourActu+6}`, [NbrCigJourActu, dateComplete]),
	WriteOneCellInGoogleSheets("write", "A3", NbrCigJourActu)
    ]);


    //Réactivation bouton
    AddCig.disabled = false,
    AddCig.textContent = "Ajouter"

});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Action Bouton Changement de jour
Bp_TestChgmtJour.addEventListener("click", async() => {

    //Mémorisation date
    localStorage.setItem("DateCigJourSaved", 0);
    
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Action Bp Test chargement bdd
Bp_TestLoadBDD.addEventListener("click", () => {
    sessionStorage.removeItem("FrtmPageLoaded")
    
});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Declenchement toutes les secondes
setInterval(() => {
    //Affichage intervalle dernière cig ///////////////////////////////////////////
    const DateActu = new Date();
    const DateLastCig = new Date(localStorage.getItem("MemDateLastCig") ||0);
    const CalcInterval = Math.floor((DateActu - DateLastCig) / 1000);;
    const heure = Math.floor(CalcInterval / 3600);
    const minute = Math.floor((CalcInterval % 3600) / 60);
    const seconde = CalcInterval % 60;
    const Intervalle = `${heure}h ${minute}m ${seconde}s`;
    IntervalleCig.textContent = Intervalle;


    if(DateLastCig != 0){
    IntervalleCig.textContent = `${heure}h ${minute}m ${seconde}s`;
    } else {
        IntervalleCig.textContent = 0;
    };

    localStorage.setItem("Intervalle", Intervalle);


}, 1000);
