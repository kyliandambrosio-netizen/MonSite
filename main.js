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
let TabMois = [];
let TabAnnee = [];
let Record = null;
let Preference = null;
const CollTabJour = query(collection(db, "TabJour"), orderBy("dateTri", "desc"));
const CollTabSemaine = query(collection(db, "TabSemaine"), orderBy("LastFum", "asc"));
const CollTabMois = query(collection(db, "TabMois"), orderBy("id", "asc"));
const CollTabAnnee = query(collection(db, "TabAnnee"), orderBy("id", "asc"));

    /////////////////////////////////////////////
    //Chargement collection Tableau Jour
    onSnapshot(CollTabJour, snapshot => {
    TabJour = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    //Refresh Object Html
    VisuTabJour(TabJour)
    Cpt_CigJour.textContent = TabJour.length;
    })

    /////////////////////////////////////////////
    //Chargement collection Tableau Semaine
    onSnapshot(CollTabSemaine, snapshot => {
    TabSemaine = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    })

    /////////////////////////////////////////////
    //Chargement collection Tableau Mois
    onSnapshot(CollTabMois, snapshot => {
    TabMois = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    })

    /////////////////////////////////////////////
    //Chargement collection Tableau Annee
    onSnapshot(CollTabAnnee, snapshot => {
    TabAnnee = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    })

    /////////////////////////////////////////////
    //Chargement collection GlobalData Record
    onSnapshot(doc(db, "GlobalData", "Record"), snapshot => {
        Record = snapshot.data();
        localStorage.setItem("RecordIntervalleLoc", Record.RecIntervalle)
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
const IntervalleCig = document.getElementById("IntervalleCig");
const SpanRecordIntervalleCig = document.getElementById("RecordIntervalle");
const SpanMoyenneJourIntervalle = document.getElementById("MoyenneJourIntervalle");
const SpanMoyenneJourNbrF = document.getElementById("MoyenneJourNbrF");
const TabJourHtml = document.getElementById("TabVisuJour");
const Bp_RazTotal = document.getElementById("RazTotal");
const Bp_AjoutLigneManu = document.getElementById("Bp_AddCig_Historique");
const AjoutLigneManu = document.getElementById("AjoutLigneManu");

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Changement Page
window.showTab = async function(Page) {
    const tabs = document.querySelectorAll(".Tab");
    tabs.forEach(tab => {
        tab.style.display = tab.id === Page ? "block" : "none";
    })

    if(Page == "Analyse") await showOngletchoixAnalyse("AnalyseSemaine");

}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Changement Page > Sur Analyse > affichage Semaine / mois / annee
window.showOngletchoixAnalyse = function(Page) { 
    const tabs = document.querySelectorAll("#Analyse .Tab");
    tabs.forEach(tab => {
        tab.style.display = tab.id === Page ? "block" : "none";
    })

    CalcMoyenne(Page)
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
    let IntervalleHms = "0";
    let intervalleSeconde = 0;


    //Ecriture Ligne Bdd
    await setDoc(doc(db, "TabJour", MyId), {
        date : DateActuStringComplet,
        dateTri: DateActuString,
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
//Bp Ajout Cig historique
Bp_AjoutLigneManu.addEventListener("click", async() => {
    const AjoutLigneDate = new Date();
    const [HeureUser, MinuteUser] = AjoutLigneManu.value.split(":");

    AjoutLigneDate.setHours(HeureUser, MinuteUser, 0);

    const AjourLigneDateString = new Date(AjoutLigneDate).toISOString();
    const AjourLigneDateStringHour = new Date(AjoutLigneDate).getHours().toString().padStart(2, "0");
    const AjourLigneDateStringMinute = new Date(AjoutLigneDate).getMinutes().toString().padStart(2, "0");
    const AjourLigneDateStringSeconde = new Date(AjoutLigneDate).getSeconds().toString().padStart(2, "0");
    const AjourLigneDateStringComplet = `${AjourLigneDateStringHour} : ${AjourLigneDateStringMinute} : ${AjourLigneDateStringSeconde}`

    //Ecriture Ligne Bdd
    await setDoc(doc(db, "TabJour", `Ajout${AjourLigneDateString}`), {
        date : AjourLigneDateStringComplet,
        dateTri: AjourLigneDateString,
        type : "C"
    })
    
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
        tdIndex.textContent = (Data.length-index);
        
        //Date
        const tdDate = document.createElement("td");
        tdDate.textContent = ligne.date;

        //Calcul Intervalle + Record intervalle
        const tdIntervalle = document.createElement("td");
        let DateSeconde = 0;
        let intervalle = 0;

        if (index==Data.length-1) {
            tdIntervalle.textContent = 0;
        } else {
            DateSeconde = Math.floor((new Date(Data[index].dateTri) - new Date(Data[index+1].dateTri)) / 1000);
            const Interheure = Math.floor((DateSeconde) / 3600);
            const Interminute = Math.floor((DateSeconde % 3600) / 60);
            const InterSeconde = DateSeconde % 60;
            intervalle = `${Interheure} h ${Interminute} min ${InterSeconde} s`;
            tdIntervalle.textContent = intervalle;
        }

        //Nouveau record
        const RecordIntervalle = localStorage.getItem("RecordIntervalleLoc");
        if (DateSeconde > RecordIntervalle) {RecordIntervalle
            setDoc(doc(db, "GlobalData", "Record"),  {
                RecIntervalle : DateSeconde
            })
        }

        //Bp Suppression ligne
        const tdBtn = document.createElement("td");
        const btn = document.createElement("button");
        btn.textContent = "❌";

        btn.onclick =  () => {SupprimerLigne(ligne.id)};

        tdBtn.appendChild(btn);
        tr.appendChild(tdIndex);
        tr.appendChild(tdDate);
        tr.appendChild(tdIntervalle);
        tr.appendChild(tdBtn);

        TabJourHtml.appendChild(tr);
        };

    });

    localStorage.setItem("TabJourLocal", JSON.stringify(Data))

}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function SupprimerLigne(id) {

    //Si suppresion ligne 1 > Raz intervalle ligne 2 avant supp ligne 1
    if (TabJour[0].id == id && TabJour.length != 1) {
    
    await setDoc(doc(db, "TabJour", TabJour[1].id), {
        date : TabJour[1].date,
        dateTri: TabJour[1].dateTri,
        type : TabJour[1].type
    })
    }

    await deleteDoc(doc(db, "TabJour", id));
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function calcAffDate(DateSeconde) {
    const Interheure = Math.floor((DateSeconde) / 3600);
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
    const DateActu = new Date();
    let intervalleSeconde = 0;
    const MemEnCour = JSON.parse(localStorage.getItem("MemChangementJourEnCours"));

    if (TabJour.length !=0) {
        LastDate = new Date(TabJour[0].dateTri);
        intervalleSeconde = Math.floor((DateActu - LastDate) / 1000);

    } else if (TabSemaine.length !=0) {
        LastDate = new Date(TabSemaine[(TabSemaine.length-1)].LastFum);
        intervalleSeconde = Math.floor((DateActu - LastDate) / 1000);
    }


    const ReccordInter = Record.RecIntervalle;

    //Affichage Intervalle denière fum
    IntervalleCig.textContent = await calcAffDate(intervalleSeconde)

    //Affichage Reccord Interval
    if (intervalleSeconde >= ReccordInter || (TabJour.length == 0 && TabSemaine.length == 0)) {
        SpanRecordIntervalleCig.textContent = await calcAffDate(intervalleSeconde);
    } else if(!MemEnCour) {
        SpanRecordIntervalleCig.textContent = await calcAffDate(ReccordInter)

    };

    //Changement de jour
    const JourActu = new Date().getDate()

   if (Preference.JourSemaineDataSaved != JourActu) {
    if (MemEnCour) return;

    localStorage.setItem("MemChangementJourEnCours", JSON.stringify(true));
    await ChangementJour ();
    localStorage.setItem("MemChangementJourEnCours", JSON.stringify(false));
   }

    }, 1000);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Changement De Jour
async function ChangementJour () {
    const JourActu = new Date().getDate();

    //Calcul Moyenne Jour
    const MoyenneJour = CalcMoyenne();

    //Ecriture ligne Jour Semaine Bdd
    let dateTri = 0;
    let MoyenneJourTemp = 0;
    const DateActuString = new Date().toISOString();
    const SousJour = new Date();
    SousJour.setDate(SousJour.getDate()-1);
    const MyId = `${SousJour.toISOString()}`;

    if (TabJour.length != 0) {
        dateTri = TabJour[TabJour.length-1].dateTri;
        MoyenneJourTemp = (MoyenneJour / (TabJour.length-1));
    }

    await setDoc(doc(db, "TabSemaine", MyId), {
        LastFum : dateTri,
        NbrF : TabJour.length,
        MoyenneInter : MoyenneJourTemp

    })

    //Ecriture Jour dat saved 
    await setDoc(doc(db, "GlobalData", "Preference"), {
        JourSemaineDataSaved: JourActu
    })


    //Raz Tableau jour
   while (TabJour.length != 0) {
        await deleteDoc(doc(db, "TabJour", TabJour[TabJour.length-1].id));
   }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Changement De Semaine
function ChangementSemaine() {
    console.log("Changement de semaine TODO")
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Calcul moyenne
async function CalcMoyenne(ChoixAnalyse) {
    const TabJourLoc = JSON.parse(localStorage.getItem("TabJourLocal"));
    let MoyenneIntervalleQuot = 0;
    let MoyenneNbrFQuot = 0;
    let NbrDataIntervalle = 0;
    let NbrDataF = 0;
    let ResultatMoyenne = 0;


    //Calcul Moyenne   
    //Jour actu
    for (let index = (TabJourLoc.length-2); index >= 0 ; index--) {
            MoyenneIntervalleQuot += Math.floor((new Date(TabJourLoc[index].dateTri) - new Date(TabJourLoc[index+1].dateTri)) / 1000); 
            NbrDataIntervalle++;
        
        MoyenneNbrFQuot = TabJourLoc.length;
    }
    NbrDataF++;

        //Semaine
    if (ChoixAnalyse == "AnalyseMois" || ChoixAnalyse == "AnalyseAnnee" || ChoixAnalyse == "AnalyseSemaine") {    
        for (let index = (TabSemaine.length-1); index >= 0  ; index--) {
            MoyenneIntervalleQuot += (TabSemaine[index].MoyenneInter * (TabSemaine[index].NbrF-1)); 
            NbrDataIntervalle += (TabSemaine[index].NbrF-1);
            MoyenneNbrFQuot += TabSemaine[index].NbrF;
            NbrDataF++;

        }
    }

        //Mois
    if (ChoixAnalyse == "AnalyseMois" || ChoixAnalyse == "AnalyseAnnee") {
        for (let index = (TabMois.length-1); index >= 0  ; index--) {
        MoyenneIntervalleQuot += (TabMois[index].MoyenneInter * (TabMois[index].NbrF-1)); 
        NbrDataIntervalle += (TabMois[index].NbrF-1);
        MoyenneNbrFQuot += TabMois[index].NbrF;
        NbrDataF++;
        }
    }
    
        //Annee
    if (ChoixAnalyse == "AnalyseAnnee") {
        for (let index = (TabAnnee.length-1); index >= 0  ; index--) {
        MoyenneIntervalleQuot += (TabAnnee[index].MoyenneInter * TabAnnee[index].NbrF); 
        NbrDataIntervalle += TabAnnee[index].NbrF;
        MoyenneNbrFQuot += TabAnnee[index].NbrF;
        NbrDataF+= TabAnnee[index].NbrJour;
        }
    }

    if (NbrDataIntervalle !=0) {
        ResultatMoyenne = await calcAffDate(parseInt(MoyenneIntervalleQuot/NbrDataIntervalle))
    } else {
        SpanMoyenneJourIntervalle.textContent = "0";
    }

    SpanMoyenneJourIntervalle.textContent = ResultatMoyenne;
    SpanMoyenneJourNbrF.textContent = parseInt(MoyenneNbrFQuot/NbrDataF);
    return ResultatMoyenne;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
window.addEventListener("DOMContentLoaded", () => {
    showTab("Home");
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Remise à zéro programme suivi
Bp_RazTotal.addEventListener("click", async() => {
    //Raz Table Jour 
    while (TabJour.length != 0) {     
        await deleteDoc(doc(db, "TabJour", TabJour[0].id));
    }

    //Raz Table Semaine 
    while (TabSemaine.length != 0) {     
    await deleteDoc(doc(db, "TabSemaine", TabSemaine[0].id));
    }

})
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
