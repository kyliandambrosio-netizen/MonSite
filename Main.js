///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Import FireBase
    // Import the functions you need from the SDKs you need
    import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";

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
        setDoc,
        onSnapshot,
        deleteDoc,
        doc,
        query,
        orderBy
     } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";


//Chargement BDD =>
const db = getFirestore();
let TabJour = [];
let TabSemaine = [];
let Record = null;
let Preference = null;
const CollTabJour = query(collection(db, "TabJour"), orderBy("dateTri", "asc"));
const CollTabSemaine = query(collection(db, "TabSemaine"), orderBy("LastFum", "asc"));

    /////////////////////////////////////////////
    //Chargement collection Tableau Jour
    onSnapshot(CollTabJour, snapshot => {
    TabJour = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    //Refresh Object Html
    VisuTabJour(TabJour)
    CalcMoyenneJourSemaine();
    })

    //Chargement collection Tableau Semaine
    onSnapshot(CollTabSemaine, snapshot => {
    TabSemaine = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    CalcMoyenneJourSemaine();
    })

    /////////////////////////////////////////////
    //Chargement collection GlobalData Record
    onSnapshot(doc(db, "GlobalData", "Record"), snapshot => {
        Record = snapshot.data();
    })

    /////////////////////////////////////////////
    //Chargement collection GlobalData Preference
    onSnapshot(doc(db, "GlobalData", "Preference"), snapshot => {
        Preference = snapshot.data();
    })


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Déclaration Objet Html
const AddCig = document.getElementById("Bp_AddCig");
const Cpt_CigJour = document.getElementById("Cpt_CigJour");
const Bp_TestChgmtJour = document.getElementById("Bp_TestChgmtJour");
const Bp_Test = document.getElementById("Bp_Test");
const IntervalleCig = document.getElementById("IntervalleCig");
const SpanRecordIntervalleCig = document.getElementById("RecordIntervalle");
const SpanMoyenneJour = document.getElementById("MoyenneJour");
const TabJourHtml = document.getElementById("TabVisuJour");

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Changement Page
window.showTab = function(Page) {
    const tabs = document.querySelectorAll(".Tab");
    tabs.forEach(tab => {
        tab.style.display = tab.id === Page ? "block" : "none";
    })

}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Ajout ligne dans tableau jour
async function AddLigneTabJour(Type) {
    const DateActuString = new Date().toISOString();
    const DateActuStringHour = new Date().getHours().toString().padStart(2, "0");
    const DateActuStringMinute = new Date().getMinutes().toString().padStart(2, "0");
    const DateActuStringSeconde = new Date().getSeconds().toString().padStart(2, "0");
    const DateActuStringComplet = `${DateActuStringHour} : ${DateActuStringMinute} : ${DateActuStringSeconde}`
    const DateActu = new Date();
    const MyId = `Ajout${DateActuString}`;
    const ReccordInter = Record.Intervalle;

    let LastDate = 0;
    let IntervalleHms = "0";
    let intervalleSeconde = 0;

    //Vérification Tableau Non Vide 
    if (TabJour.length !=0) { 
        //Recuperation derniere ligne pour calcule intervalle
        LastDate = TabJour[(TabJour.length-1)].dateTri;

        //Calcul intervalle
        intervalleSeconde = Math.floor((DateActu - new Date(LastDate)) / 1000);
        IntervalleHms = await calcAffDate(intervalleSeconde)
    }  

    //Si reccord intervalle > Ecriture reccord dans bdd
    if (intervalleSeconde >= ReccordInter || (TabJour.length == 0 && TabSemaine.length == 0)) {
    await setDoc(doc(db, "GlobalData", "Record"), {
    Intervalle : intervalleSeconde
        
    })
        }

    //Ecriture Ligne Bdd
    await setDoc(doc(db, "TabJour", MyId), {
        date : DateActuStringComplet,
        dateTri: DateActuString,
        inter : IntervalleHms,
        interSeconde : intervalleSeconde,
        type : Type
    })

}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Bp Ajout Cig
AddCig.addEventListener("click", async() => {
    const Type = "C";
    AddLigneTabJour(Type);
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Gestion affichage jour
async function VisuTabJour(Data) {
    const tbody = document.getElementById("TabVisuJour");

    TabJourHtml.innerHTML ="";
    
    Data.forEach((ligne, index) => {

        if (ligne.date != undefined) {

        const tr = document.createElement("tr");

        //Index
        const tdIndex = document.createElement("td");
        tdIndex.textContent = index+1;
        
        //Date
        const tdDate = document.createElement("td");
        tdDate.textContent = ligne.date;

        //Intervalle
        const tdIntervalle = document.createElement("td");
        tdIntervalle.textContent = ligne.inter;

        //Intervalle Seconde
        const tdIntervalleSec = document.createElement("td");
        tdIntervalleSec.textContent = ligne.IntervalleSec;

        //Bp Suppression ligne
        const tdBtn = document.createElement("td");
        const btn = document.createElement("button");
        btn.textContent = "❌";

        btn.onclick =  () => {SupprimerLigne(ligne.id)};

        tdBtn.appendChild(btn);
        tr.appendChild(tdIndex);
        tr.appendChild(tdDate);
        tr.appendChild(tdIntervalle);
        tr.appendChild(tdIntervalleSec);
        tr.appendChild(tdBtn);

        TabJourHtml.appendChild(tr);
        };
    });

}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function SupprimerLigne(id) {

    //Si suppresion ligne 1 > Raz intervalle ligne 2 avant supp ligne 1
    if (TabJour[0].id == id && TabJour.length != 1) {
    
    await setDoc(doc(db, "TabJour", TabJour[1].id), {
        date : TabJour[1].date,
        dateTri: TabJour[1].dateTri,
        inter : 0,
        interSeconde : TabJour[1].interSeconde,
        type : TabJour[1].dateTri
    })
    }

    await deleteDoc(doc(db, "TabJour", id));
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function calcAffDate(DateSeconde) {
    const Interheure = Math.floor((DateSeconde % 3600) / 3600);
    const Interminute = Math.floor((DateSeconde % 3600) / 60);
    const InterSeconde = DateSeconde % 60;
    const intervalle = `${Interheure} h ${Interminute} min ${InterSeconde} s`;
    return intervalle;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Declenchement toutes les seconde
setInterval(async () => {
    let LastDate = 0;

    if (TabJour.length !=0) {
        LastDate = new Date(TabJour[(TabJour.length-1)].dateTri);
    } else if (TabSemaine.length !=0) {
        LastDate = new Date(TabSemaine[(TabSemaine.length-1)].LastFum);
    } else {
        intervalleSeconde =0;
    }

    const DateActu = new Date();
    let intervalleSeconde = Math.floor((DateActu - LastDate) / 1000);
    const ReccordInter = Record.Intervalle;

    //Affichage Intervalle denière fum
    IntervalleCig.textContent = await calcAffDate(intervalleSeconde)

    //Affichage Reccord Interval
    if (intervalleSeconde >= ReccordInter || (TabJour.length == 0 && TabSemaine.length == 0)) {
        SpanRecordIntervalleCig.textContent = await calcAffDate(intervalleSeconde);
    } else {
        SpanRecordIntervalleCig.textContent = await calcAffDate(ReccordInter)

    };

    //Changement de jour

    }, 1000);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Changement De Jour
Bp_TestChgmtJour.addEventListener("click", async () => {
    const dateActu = new Date();
    const JourPrecedent = Math.floor(dateActu.getDay()-1);
    let MoyenneJour = 0;

    //Calcul Moyenne Jour
    for (let index = (TabJour.length-1); index > 0 ; index--) {
        MoyenneJour = MoyenneJour + TabJour[index].interSeconde; 
    }

    //Ecritrue ligne Jour Semaine Bdd
    await setDoc(doc(db, "TabSemaine", `Jour:${JourPrecedent}`), {
        LastFum : TabJour[TabJour.length-1].dateTri,
        NbrC : TabJour.length,
        MoyenneInter : (MoyenneJour / (TabJour.length-1))

    })


    //Raz Tableau jour
   while (TabJour.length != 0) {
        await deleteDoc(doc(db, "TabJour", TabJour[TabJour.length-1].id));
   }
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Bp test droite supprimer jour
async function CalcMoyenneJourSemaine() {
       //Calcul Moyenne Jour Semaine
    let MoyenneJourSemaine = 0;
    let NbrData = 0;
    let ResultatMoyenne = 0;
        
        //Jour actu
    for (let index = (TabJour.length-1); index >= 1 ; index--) {
        MoyenneJourSemaine = MoyenneJourSemaine + TabJour[index].interSeconde; 
        NbrData = NbrData + 1;
    }
        //jour de la semaine
    for (let index = (TabSemaine.length-1); index >= 0  ; index--) {
        MoyenneJourSemaine = MoyenneJourSemaine + TabSemaine[index].MoyenneInter; 
        NbrData = NbrData + 1;
    }
    
    //Refresh Object Hmtl
    Cpt_CigJour.textContent = TabJour.length;

    if (NbrData !=0) {
    SpanMoyenneJour.textContent = await calcAffDate(parseInt(MoyenneJourSemaine/NbrData))
    } else {
    SpanMoyenneJour.textContent = "0";
    }

}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
window.addEventListener("DOMContentLoaded", () => {
    showTab("Home");
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////