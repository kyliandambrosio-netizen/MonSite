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
let Record = null;
const CollTabJour = query(collection(db, "TabJour"), orderBy("dateTri", "asc"));

    /////////////////////////////////////////////
    //Chargement collection Tableau Jour
    onSnapshot(CollTabJour, snapshot => {
    TabJour = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    //Refresh Object Html
    VisuTabJour(TabJour)
    })

    /////////////////////////////////////////////
    //Chargement collection stats
    onSnapshot(doc(db, "GlobalData", "Record"), snapshot => {
        Record = snapshot.data();
    })
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function AddLigneTabJour(Type) {
    const DateActuVisu = new Date().toLocaleString();
    const DateActuString = new Date().toISOString();
    const DateActu = new Date();
    const MyId = `Ajout${DateActuString}`;
    const ReccordInter = Record.Intervalle;

    let LastDate = 0;
    let IntervalleHms = "0";
    let intervalleSeconde = 0;

    //Vérification Tableau Non Vide 
    if (TabJour.length !=0) { 
        //Recuperation derniere ligne pour calcule intervalle
        const LastDate = TabJour[(TabJour.length-1)].dateTri;

        //Calcul intervalle
        intervalleSeconde = Math.floor((DateActu - new Date(LastDate)) / 1000);
        IntervalleHms = await calcAffDate(intervalleSeconde)
    }  

    //Ecriture Ligne Bdd
    await setDoc(doc(db, "TabJour", MyId), {
        date : DateActuVisu,
        dateTri: DateActuString,
        inter : IntervalleHms,
        interSeconde : intervalleSeconde,
        type : Type
    })

    //Si reccord intervalle > Ecriture reccord dans bdd
    if (intervalleSeconde > ReccordInter) {
    SpanRecordIntervalleCig.textContent = await calcAffDate(ReccordInter)
    await setDoc(doc(db, "GlobalData", "Record"), {
    Intervalle : intervalleSeconde
        
    })
        }



    SpanMoyenneJour.textContent = await CalcMoyenne(TabJour)
    
}

async function CalcMoyenne(Tableau) {
    //Calcul Moyenne Jour
    let MoyenneJour = 0;

    for (let index = (Tableau.length-1); index > 0 ; index--) {
        MoyenneJour = MoyenneJour + Tableau[index].interSeconde; 
    }

    return await calcAffDate(parseInt(MoyenneJour/(Tableau.length-1)))
}

Bp_Test.addEventListener("click", async() => {
    
    const A = await CalcMoyenne(TabJour)
    SpanMoyenneJour.textContent = A;
    
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Bp Ajout Cig
AddCig.addEventListener("click", async() => {
    const Type = "C";
    AddLigneTabJour(Type);
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Action Page Refresh
document.addEventListener("DOMContentLoaded", () => {
    //Affichage Mode Sombre ou Claire
    AffModeSombreClaire();

});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Action Bouton Changement Mode Sombre/Claire
ChoixModeAff.addEventListener("click", ChgmtModeSombreClaire);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Gestion Tableau affichage jour
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

    //Refresh Object Hmtl
    Cpt_CigJour.textContent = TabJour.length;
    SpanMoyenneJour.textContent = await CalcMoyenne(TabJour)

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
    const Interheure = Math.floor(DateSeconde / 3600);
    const Interminute = Math.floor((DateSeconde % 3600) / 60);
    const InterSeconde = DateSeconde % 60;

    const intervalle = `${Interheure}h ${Interminute}m ${InterSeconde}s`;
    return intervalle;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Declenchement toutes les seconde
setInterval(async () => {
    const DateActu = new Date();
    const LastDate = new Date(TabJour[(TabJour.length-1)].dateTri) || 0;
    const intervalleSeconde = Math.floor((DateActu - LastDate) / 1000);
    const ReccordInter = Record.Intervalle;

    //Affichage Intervalle denière fum
    IntervalleCig.textContent = await calcAffDate(intervalleSeconde)

    //Affichage Reccord Interval
    if (intervalleSeconde >= ReccordInter) {
    SpanRecordIntervalleCig.textContent = await calcAffDate(intervalleSeconde)
    } else {
     SpanRecordIntervalleCig.textContent = await calcAffDate(ReccordInter)
    };

    }, 1000);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////