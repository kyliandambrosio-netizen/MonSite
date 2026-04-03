///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Import FireBase
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
        setDoc,
        getDocs,
        onSnapshot,
        deleteDoc,
        doc,
        query,
        orderBy
     } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";
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
import { ReadataInGoogleSheets, WriteRangeInGoogleSheets } from './GestBdd.js';
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Action Bouton test
Bp_Test.addEventListener("click", async() => {
const db = getFirestore();
const TabVisuJour = ((localStorage.getItem("VisuTableauJour"))) || []; //Load tableau jour local

 await addDoc(collection(db, "TabJour"), {
    id: "tab0",
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

    
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//ajout cig
AddCig.addEventListener("click", async() => {
    const db = getFirestore();
    const DateActu = new Date().toLocaleString();
    const MyId = `Ajout${new Date().toISOString()}`;
    const LastFum = await getDocs(q);
    let LastDate = 0;
    let intervalle = 0;

    if (LastFum.size !=0) { //Tableau rempli avec au moins 1 document
        const LastDateDoc = LastFum.docs[(LastFum.size-1)];
        LastDate = LastDateDoc.data().date;
        intervalle = DateActu - LastDate;

    } else { //Tableau vide > premiere donnée
        intervalle = 0;
    }

    //Ecriture Ligne Bdd
    await setDoc(doc(db, "TabJour", MyId), {
        date : DateActu,
        dateTri: new Date().toISOString(),
        inter : intervalle
    })

});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function SupprimerFume(id) {
    await deleteDoc(doc(db, "TabJour", id));
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Action Page Refresh
document.addEventListener("DOMContentLoaded", () => {
    //Affichage Mode Sombre ou Claire
    AffModeSombreClaire();

});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Action Bouton Changement Mode Sombre/Claire
ChoixModeAff.addEventListener("click", ChgmtModeSombreClaire);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Affichage temps reel Bdd
const db = getFirestore();
const q =query(collection(db, "TabJour"), orderBy("dateTri", "asc"));
onSnapshot(q, snapshot => {
    
 const data = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
 }));

 VisuTabJour(data)
    Cpt_CigJour.textContent = data.length;

})

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Gestion Tableau affichage jour
function VisuTabJour(Data) {

    const tbody = document.getElementById("TabVisuJour");

    TabJourHtml.innerHTML ="";
    
    Data.forEach((ligne, index) => {

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

        btn.onclick =  () => {SupprimerFume(ligne.id)};

        tdBtn.appendChild(btn);
        tr.appendChild(tdIndex);
        tr.appendChild(tdDate);
        tr.appendChild(tdIntervalle);
        tr.appendChild(tdIntervalleSec);
        tr.appendChild(tdBtn);

        TabJourHtml.appendChild(tr);
    });
}
