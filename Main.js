///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Déclaration Objet Html
const ChoixModeAff = document.getElementById("Bp_ChoixModeAff");
const AddCig = document.getElementById("Bp_AddCig");
const Cpt_CigJour = document.getElementById("Cpt_CigJour");
const Bp_TestChgmtJour = document.getElementById("Bp_TestChgmtJour");
const Bp_TestLoadBDD = document.getElementById("TestChargementBdd");
const IntervalleCig = document.getElementById("IntervalleCig");
const SpanRecordIntervalleCig = document.getElementById("RecordIntervalle");
const SpanMoyenneJour = document.getElementById("MoyenneJour");

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
        console.log("Loading BDD IN PROGRESS");

        const DataRead = await ReadataInGoogleSheets() || [];
        const NbrCigJour = DataRead[2][0] || 0; //Compteur Cig
        const LastJour = DataRead[1][7] || 0; //MemJour
        const recordIntervalle = DataRead[1][2] || 0; //Record intervalle data en seconde
        const MoyenneJour = DataRead[2][2] || 0; //Intervalle moyen journée
        let DateLastCig = 0;

        localStorage.setItem("MoyenneJour", MoyenneJour)
        localStorage.setItem("RecordIntervalle", recordIntervalle);
        localStorage.setItem("DateCigJourSaved", parseInt(LastJour));
        localStorage.setItem("NbrCigJour", parseInt(NbrCigJour));

        //Chargement date dernier cig > Tab cig jour actu si nbrcig <> 0 sinon tab memo jour
        if (NbrCigJour > 0) {
            DateLastCig = DataRead[NbrCigJour+5][1];
        } else {
            DateLastCig = DataRead[28][10] || 0;
        };

         localStorage.setItem("MemDateLastCig", DateLastCig);

        //Changement Jour///////////////////////////////////////////////////////////////////////
        if (LastJour  != dateActuelJour) {
        const MemNbrCigJour = localStorage.getItem("NbrCigJour");
        const IndexMemJour = parseInt(dateActuelJour)+2;

        //Raz compteur cig local
        localStorage.setItem("NbrCigJour", 0)

        await Promise.all([
        //création ligne mémorisation Jour actu
        WriteOneCellInGoogleSheets("writeOnceCell", `I${IndexMemJour}`, dateComplete),

        //Memorisation nombre cig jour précédent + Date derniere cig du jour
        WriteRangeInGoogleSheets("writeRange", `J${LastJour+2}:K${LastJour+2}`, [MemNbrCigJour, DateLastCig]),

        //Raz Zone mémoire google sheet Cig jour 
        WriteOneCellInGoogleSheets("write", "A3", 0),
        WriteOneCellInGoogleSheets("write", "A5", 0),
        WriteRangeInGoogleSheets("razRange", "A7:D200", 0)
        ]);



        //Mémorisation date
        localStorage.setItem("DateCigJourSaved", dateActuelJour);
        WriteOneCellInGoogleSheets("write", "H2", dateActuelJour)
        };
    

    

    //MAJ Visu object html
    Cpt_CigJour.textContent =  parseInt(localStorage.getItem("NbrCigJour"));;

    const MoyenneH = Math.floor(MoyenneJour / 3600);
    const MoyenneM = Math.floor((MoyenneJour % 3600) / 60);
    const MoyenneS = MoyenneJour % 60;
    const MoyenneHms = `${MoyenneH}h ${MoyenneM}m ${MoyenneS}s`;
    SpanMoyenneJour.textContent = MoyenneHms;

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
    let IntervalleLastCig = 0;
    let IntervalleSeconde= 0;

    //Bloquage bouton pendant envoie données
    AddCig.disabled = true,
    AddCig.textContent = "Envoie en cours"

    //Loading Local Data
    let NbrCigJourActu = parseInt(localStorage.getItem("NbrCigJour")) || 0;

    //Récuperation intervalle 
    if (NbrCigJourActu != 0) {
        IntervalleLastCig = localStorage.getItem("IntervalleHms");
        IntervalleSeconde = localStorage.getItem("IntervalleSeconde");
    } else {
        IntervalleLastCig = 0;
        IntervalleSeconde = 0;
    };

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
    WriteRangeInGoogleSheets("writeRange", `A${NbrCigJourActu+6}:D${NbrCigJourActu+6}`, [NbrCigJourActu, DateActu, IntervalleLastCig, IntervalleSeconde]),
	WriteOneCellInGoogleSheets("write", "A3", NbrCigJourActu)
    ]);


    //Réactivation bouton
    AddCig.disabled = false,
    AddCig.textContent = "Ajouter"

});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Action Bouton Changement de jour
Bp_TestChgmtJour.addEventListener("click", async() => {

     WriteOneCellInGoogleSheets("write", "H2", 27)
     sessionStorage.removeItem("FrtmPageLoaded")
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
    let RecordIntervalle = localStorage.getItem("RecordIntervalle") || 0;
    const DateActu = new Date();
    const DateLastCig = new Date(localStorage.getItem("MemDateLastCig") ||0);
    const Intervalle = Math.floor((DateActu - DateLastCig) / 1000);
    const heure = Math.floor(Intervalle / 3600);
    const minute = Math.floor((Intervalle % 3600) / 60);
    const seconde = Intervalle % 60;
    const IntervalleHms = `${heure}h ${minute}m ${seconde}s`;

    //Record intervalle
    if (Intervalle >= RecordIntervalle) {
        RecordIntervalle = Intervalle;
        WriteOneCellInGoogleSheets("WriteOneCell", "C2", RecordIntervalle)
    }

    const heureRecord = Math.floor(RecordIntervalle / 3600);
    const minuteRecord = Math.floor((RecordIntervalle % 3600) / 60);
    const secondeRecord = RecordIntervalle % 60;
    const Record = `${heureRecord}h ${minuteRecord}m ${secondeRecord}s`;
    SpanRecordIntervalleCig.textContent = Record;


    if(DateLastCig != 0){
    IntervalleCig.textContent = IntervalleHms;
    } else {
        IntervalleCig.textContent = 0;
    };

    localStorage.setItem("IntervalleHms", IntervalleHms);
    localStorage.setItem("IntervalleSeconde", Intervalle);
    localStorage.setItem("RecordIntervalle", RecordIntervalle);

}, 1000);