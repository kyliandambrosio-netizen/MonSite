///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Déclaration Objet Html
const ChoixModeAff = document.getElementById("Bp_ChoixModeAff");
const AddCig = document.getElementById("Bp_AddCig");
const Cpt_CigJour = document.getElementById("Cpt_CigJour");
const Bp_TestChgmtJour = document.getElementById("Bp_TestChgmtJour");
const Bp_Test = document.getElementById("Bp_Test");
const IntervalleCig = document.getElementById("IntervalleCig");
const SpanRecordIntervalleCig = document.getElementById("RecordIntervalle");
const SpanMoyenneJour = document.getElementById("MoyenneJour");
const TabJourHtml = document.getElementById("TabVisuJour");

//Liaison fonction
import { ChgmtModeSombreClaire, AffModeSombreClaire } from './VisuPage.js';
import { ReadataInGoogleSheets, WriteOneCellInGoogleSheets, WriteRangeInGoogleSheets } from './GestBdd.js';


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Action Page Refresh
document.addEventListener("DOMContentLoaded", async () => {
    //Affichage Mode Sombre ou Claire
    AffModeSombreClaire();

    //Refresh data depuis sheets
    RefreshDataFromSheets();

    //Refresh tableau jour
    let VisuTableauMemJour = JSON.parse(localStorage.getItem("VisuTableauJour")) || []; //Load tableau jour local
    VisuTabJour(VisuTableauMemJour);

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
    let NbrCigJourActu = localStorage.getItem("NbrCigJour") || 0;

    //Récuperation intervalle 
    if (NbrCigJourActu != 0) {
        IntervalleLastCig = localStorage.getItem("IntervalleHms");
        IntervalleSeconde = localStorage.getItem("IntervalleSeconde");
    } else {
        IntervalleLastCig = 0;
        IntervalleSeconde = 0;
    };

    //Bloquage bouton pendant envoie données
    AddCig.disabled = true,
    AddCig.textContent = "Envoie en cours"

    //Mémorisation Date
    localStorage.setItem("MemDateLastCig", DateActu);

    //Refresh Tableau Jour 
    let paramTab = JSON.parse(localStorage.getItem("VisuTableauJour")) || []; //Load tableau jour local
    
    //insertion ligne normal si aucune manquante
    paramTab.push([paramTab.length+1, dateComplete, IntervalleLastCig]);
    localStorage.setItem("VisuTableauJour", JSON.stringify(paramTab));

    //Visu span compteur nombre fum
    Cpt_CigJour.textContent = paramTab.length;

    //Refresh Tableau jour
    VisuTabJour(paramTab);
     
    //Enregistrement cptCigjour
	localStorage.setItem("NbrCigJour", paramTab.length);
    await Promise.all([
    WriteOneCellInGoogleSheets("WriteOneCell", "A3", paramTab.length),

    //Enregistremnt Google Sheets
    WriteRangeInGoogleSheets("writeArray", "", paramTab, 7, 1)
    ]);

 
    //Réactivation boutons
    AddCig.disabled = false,
    AddCig.textContent = "Ajouter"

    

 



});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Action Bouton Changement de jour
Bp_TestChgmtJour.addEventListener("click", async() => {


    sessionStorage.removeItem("FrtmPageLoaded")
    localStorage.setItem("DateCigJourSaved", 0);
    localStorage.removeItem("VisuTableauJour");
    await WriteOneCellInGoogleSheets("write", "H2", 28)

    location.reload();

    
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Action Bp Test
Bp_Test.addEventListener("click", async() => {

    let paramTab = JSON.parse(localStorage.getItem("VisuTableauJour")) || []; //Load tableau jour local
    let NbrFumJour = paramTab.length;
    const Index = 1;

    //Decrementer compteur 
    localStorage.setItem("NbrCigJour", paramTab.length+1);
    Cpt_CigJour.textContent = NbrFumJour-1;
    paramTab.splice(Index-1, 1);

    for (let i=Index-1; i<NbrFumJour-1; i++) {
        paramTab[i][0] = paramTab[i][0] -1;
    };

    //Refresh tableau
    VisuTabJour(paramTab);

    //Enregistremnt Google Sheets
    await WriteRangeInGoogleSheets("razRange", "A7:D200", 0)
    WriteRangeInGoogleSheets("writeArray", "", paramTab, 7, 1)
    localStorage.setItem("VisuTableauJour", JSON.stringify(paramTab));
    localStorage.setItem("NbrCigJour", NbrFumJour-1);
    Cpt_CigJour.textContent = NbrFumJour-1;
    


    
});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Declenchement toutes les seconde
setInterval(async() => {
    //Affichage intervalle dernière cig ///////////////////////////////////////////
    let RecordIntervalle = localStorage.getItem("RecordIntervalle") || 0;
    const DateActu = new Date();
    const DateLastCig = new Date(localStorage.getItem("MemDateLastCig"));
    const DateLastCigSeconde = Math.floor(new Date(localStorage.getItem("MemDateLastCig")) /1000);
    const Intervalle = Math.floor((DateActu - DateLastCig) / 1000);
    const heure = Math.floor(Intervalle / 3600);
    const minute = Math.floor((Intervalle % 3600) / 60);
    const seconde = Intervalle % 60;
    const IntervalleHms = `${heure}h ${minute}m ${seconde}s`;


    //Record intervalle
    if(DateLastCigSeconde != 946681200){
        if (Intervalle >= RecordIntervalle && Intervalle != 0) {
            RecordIntervalle = Intervalle;
           WriteOneCellInGoogleSheets("WriteOneCell", "C2", RecordIntervalle)
        }
        }

    const heureRecord = Math.floor(RecordIntervalle / 3600);
    const minuteRecord = Math.floor((RecordIntervalle % 3600) / 60);
    const secondeRecord = RecordIntervalle % 60;
    const Record = `${heureRecord}h ${minuteRecord}m ${secondeRecord}s`;
    


    if(DateLastCigSeconde != 946681200){
        IntervalleCig.textContent = IntervalleHms;
        SpanRecordIntervalleCig.textContent = Record;     
           
    } else {
        IntervalleCig.textContent = 0;
        SpanRecordIntervalleCig.textContent = 0;
    };

    localStorage.setItem("IntervalleHms", IntervalleHms);
    localStorage.setItem("IntervalleSeconde", Intervalle);
    localStorage.setItem("RecordIntervalle", RecordIntervalle);


    

}, 1000);


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Récupération des datas depuis google sheets
async function RefreshDataFromSheets () {
    const now = new Date();
    const dateActuelJour = now.getDate().toString().padStart(2, '0');
    const dateActuelMois = (now.getMonth()+1).toString().padStart(2, '0');
    const dateActuelAnnee = now.getFullYear().toString();
    const dateActuelheure = now.getHours().toString().padStart(2, '0');
    const dateActuelMinute = now.getMinutes().toString().padStart(2, '0');
    const dateActuelSeconde= now.getSeconds().toString().padStart(2, '0');

    const dateComplete = `${dateActuelJour}/${dateActuelMois}/${dateActuelAnnee} ${dateActuelheure}:${dateActuelMinute}:${dateActuelSeconde}`;

    //Chargement data depuis Bdd google sheets/////////////////////////////////////////////

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
            DateLastCig = new Date(DataRead[NbrCigJour+5][1]);
        } else {
            DateLastCig = DataRead[LastJour+1][10] || 0;
            console.log(DateLastCig)
        };


         localStorage.setItem("MemDateLastCig", DateLastCig);

        //Changement Jour///////////////////////////////////////////////////////////////////////
        if (LastJour  != dateActuelJour) {
        //Désactivation bouton
        AddCig.disabled = true,
        AddCig.textContent = "Chgmt Jour En Cours"

        const MemNbrCigJour = localStorage.getItem("NbrCigJour");
        const IndexMemJour = parseInt(dateActuelJour)+2;

        //Raz compteur cig local
        localStorage.setItem("NbrCigJour", 0)

        await Promise.all([
        //création ligne mémorisation Jour actu
        WriteOneCellInGoogleSheets("writeOnceCell", `I${IndexMemJour}`, dateComplete),

        //Memorisation nombre cig jour précédent + Date derniere cig du jour
        WriteRangeInGoogleSheets("writeRange", `J${LastJour+2}:K${LastJour+2}`, [[MemNbrCigJour, DateLastCig]]),

        //Raz Zone mémoire google sheet Cig jour 
        WriteOneCellInGoogleSheets("write", "A3", 0),
        WriteOneCellInGoogleSheets("write", "A5", 0),
        WriteRangeInGoogleSheets("razRange", "A7:D200", 0)
        ]);



        //Mémorisation date
        localStorage.setItem("DateCigJourSaved", dateActuelJour);
        WriteOneCellInGoogleSheets("write", "H2", dateActuelJour)
        };
    
        //Réactivation bouton
        AddCig.disabled = false,
        AddCig.textContent = "Ajouter"

    //MAJ Visu object html
    Cpt_CigJour.textContent =  parseInt(localStorage.getItem("NbrCigJour"));;

    const MoyenneH = Math.floor(MoyenneJour / 3600);
    const MoyenneM = Math.floor((MoyenneJour % 3600) / 60);
    const MoyenneS = MoyenneJour % 60;
    const MoyenneHms = `${MoyenneH}h ${MoyenneM}m ${MoyenneS}s`;
    SpanMoyenneJour.textContent = MoyenneHms;
};


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Gestion Tableau affichage jour
function VisuTabJour(ParamTab) {
    TabJourHtml.innerHTML ="";

    ParamTab.forEach(ligne => {
    const tr = document.createElement("tr");

        ligne.forEach(cell => {
        const td = document.createElement("td");
        td.textContent = cell;
        tr.appendChild(td);
        })
    TabJourHtml.appendChild(tr);
    });


};