    // Import the functions you need from the SDKs you need
    import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyDlvVPPvQRbWdlXWUCFSB0iTCLML9r176w",
    authDomain: "sie1-a95c4.firebaseapp.com",
    projectId: "sie1-a95c4",
    storageBucket: "sie1-a95c4.firebasestorage.app",
    messagingSenderId: "485770107307",
    appId: "1:485770107307:web:e15cef3374870e9a831aee",
    measurementId: "G-BZH0GMGRP7"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

import { getFirestore,
        collection, 
        addDoc,
        getDocs,
        onSnapshot,
        deleteDoc,
        doc
     } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";




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
import { ReadataInGoogleSheets, WriteRangeInGoogleSheets } from './GestBdd.js';

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Action Bouton Changement de jour
Bp_Test.addEventListener("click", async() => {
const db = getFirestore();
const TabVisuJour = ((localStorage.getItem("VisuTableauJour"))) || []; //Load tableau jour local

 await addDoc(collection(db, "cig"), {
    data: TabVisuJour
})
   
});

Bp_TestChgmtJour.addEventListener("click", async() => {
const db = getFirestore();
 const snapshot = await getDocs(collection(db, "cig"))
 const data = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
 }));
console.log(data[0])

    
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Action Page Refresh
document.addEventListener("DOMContentLoaded", () => {
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
AddCig.addEventListener("click", () => {  
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

    //Mémorisation Date
    localStorage.setItem("MemDateLastCig", DateActu);

    //Refresh Tableau Jour 
    let paramTab = (JSON.parse(localStorage.getItem("VisuTableauJour"))) || []; //Load tableau jour local
    
    //insertion ligne normal si aucune manquante
    paramTab.push([paramTab.length+1, dateComplete, IntervalleLastCig, IntervalleSeconde]);
    localStorage.setItem("VisuTableauJour", JSON.stringify(paramTab));

    //Visu span compteur nombre fum
    Cpt_CigJour.textContent = paramTab.length;

    //Refresh Tableau jour
    VisuTabJour(paramTab);
     
    //Enregistrement cptCigjour
	localStorage.setItem("NbrCigJour", paramTab.length);

    //Enregistremnt Google Sheets
    WriteRangeInGoogleSheets("writeArray", "", paramTab, 7, 1)
 
    //Calcule Moyen jour 
    MoyJour();
 
});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Suppression ligne tableau jour
function supprimerLigne(index) {

    let paramTab = JSON.parse(localStorage.getItem("VisuTableauJour")) || []; //Load tableau jour local
    let NbrFumJour = paramTab.length;

    //Decrementer compteur 
    localStorage.setItem("NbrCigJour", paramTab.length+1);
    Cpt_CigJour.textContent = NbrFumJour-1;
    paramTab.splice(index, 1);

    for (let i=index; i<NbrFumJour-1; i++) {
        paramTab[i][0] = paramTab[i][0] -1;
    };

    //Refresh tableau
    VisuTabJour(paramTab);

    //enregistrement local
    localStorage.setItem("VisuTableauJour", JSON.stringify(paramTab));
    localStorage.setItem("NbrCigJour", NbrFumJour-1);
    Cpt_CigJour.textContent = NbrFumJour-1;

    //Enregistremnt Google Sheets  
    WriteRangeInGoogleSheets("razRange", "A7:D200", 0), //Raz Zone mémoire google sheet Cig jour 
    WriteRangeInGoogleSheets("writeArray", "", paramTab, 7, 1)

    //Calcule Moyen jour 
    MoyJour();
};


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Declenchement toutes les seconde
setInterval(() => {
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
           WriteRangeInGoogleSheets("writeOneCell", "C2", RecordIntervalle)
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
        AddCig.textContent = "Chargement ...";

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
            DateLastCig = DataRead[LastJour][10] || 0;
        };


         localStorage.setItem("MemDateLastCig", DateLastCig);

        //Changement Jour///////////////////////////////////////////////////////////////////////
        if (LastJour  != dateActuelJour) {

        console.log("Changement de jour")

        const MemNbrCigJour = localStorage.getItem("NbrCigJour");
        const IndexMemJour = parseInt(dateActuelJour)+2;

        //Raz local
        localStorage.setItem("NbrCigJour", 0)
        let paramTab = JSON.parse(localStorage.getItem("VisuTableauJour")) || []; //Load tableau jour local
        paramTab.splice(0, 0);
        localStorage.setItem("VisuTableauJour", JSON.stringify(paramTab));

        //création ligne mémorisation Jour actu
        WriteRangeInGoogleSheets("writeOneCell", `I${IndexMemJour}`, dateComplete),

        //Memorisation nombre cig jour précédent + Date derniere cig du jour
        WriteRangeInGoogleSheets("writeRange", `J${LastJour+2}:K${LastJour+2}`, [[MemNbrCigJour, DateLastCig]]),
            
        //Raz Zone mémoire google sheet Cig jour 
        WriteRangeInGoogleSheets("razRange", "A7:D200", 0)

        //Mémorisation date
        localStorage.setItem("DateCigJourSaved", dateActuelJour);
        WriteRangeInGoogleSheets("writeOneCell", "H2", dateActuelJour)
        };
    
    //MAJ Visu object html
    Cpt_CigJour.textContent =  parseInt(localStorage.getItem("NbrCigJour"));;
    AddCig.textContent = "Ajouter";

    //Calcule Moyen jour 
    MoyJour();
    
    
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Moyen Jour
function MoyJour() {

    let MoyenneJour = localStorage.getItem("MoyenneJour") || 0;
    const TableauJour = JSON.parse(localStorage.getItem("VisuTableauJour")) || []; //Load tableau jour local
    const now = new Date();
    const dateActuelJour = now.getDate().toString();

    //Calcul
    MoyenneJour = 0;
    TableauJour.forEach((ligne) => {
        if (ligne[0] != 1){
        MoyenneJour = parseInt(MoyenneJour) + parseInt(ligne[3]);
        }
    });
    
    MoyenneJour = parseInt(MoyenneJour / (TableauJour.length-1));

    //Affichage
    const MoyenneH = Math.floor(MoyenneJour / 3600);
    const MoyenneM = Math.floor((MoyenneJour % 3600) / 60);
    const MoyenneS = MoyenneJour % 60;
    const MoyenneHms = `${MoyenneH}h ${MoyenneM}m ${MoyenneS}s`;
    SpanMoyenneJour.textContent = MoyenneHms;

    //ecriture google sheets
    WriteRangeInGoogleSheets("writeOneCell", `L${parseInt(dateActuelJour)+2}`, MoyenneJour)
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Gestion Tableau affichage jour
function VisuTabJour(ParamTab) {
    TabJourHtml.innerHTML ="";
    

    ParamTab.forEach((ligne, index) => {

    const tr = document.createElement("tr");

        //Index
        const tdIndex = document.createElement("td");
        tdIndex.textContent = index+1;
        

        //Date
        const tdDate = document.createElement("td");
        tdDate.textContent = ligne[1];


        //Intervalle
        const tdIntervalle = document.createElement("td");
        tdIntervalle.textContent = ligne[2];
        

        //Intervalle Seconde
        const tdIntervalleSec = document.createElement("td");
        tdIntervalleSec.textContent = ligne[3];
        

        //Bp Suppression ligne
        const tdBtn = document.createElement("td");
        const btn = document.createElement("button");
        btn.textContent = "❌";

        btn.onclick =  () => {supprimerLigne(index)};


        tdBtn.appendChild(btn);
        tr.appendChild(tdIndex);
        tr.appendChild(tdDate);
        tr.appendChild(tdIntervalle);
        tr.appendChild(tdIntervalleSec);
        tr.appendChild(tdBtn);

        TabJourHtml.appendChild(tr);
    });



}
