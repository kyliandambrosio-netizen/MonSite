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
        updateDoc,
        onSnapshot,
        deleteDoc,
        doc,
        query,
        orderBy
     } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

//Chargement BDD =>
const db = getFirestore();
let TabJour = [];
let TabAnnee = [];
let Record = null;
let Preference = null;
const CollTabJour = query(collection(db, "TabJour"), orderBy("dateTri", "desc"));
const CollTabAnnee = query(collection(db, "TabAnnee"), orderBy("__name__", "asc"));

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

    /////////////////////////////////////////////
    //Chargement collection Tableau Jour
    onSnapshot(CollTabJour, snapshot => {
    TabJour = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    //Refresh Object Html
    Cpt_CigJour.textContent = TabJour.length;
    VisuTabJour(TabJour, false)
    })

    /////////////////////////////////////////////
    //Chargement collection Tableau Annee
    onSnapshot(CollTabAnnee, snapshot => {
    TabAnnee = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    //Refresh objet
    VisuTabJour(TabJour, true)

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
const BpTest = document.getElementById("Bp_Test");
const NumJourBpTest = document.getElementById("In_NumJourSemaine");
const BpJourHistoPlus = document.getElementById("BpChoixJourPlus");
const BpJourHistoMoins = document.getElementById("BpChoixJourMoins");
const ChoixJourHisto = document.getElementById("ChoixJourVisuTableau");
let IndexChoixVisuJourHisto = 0;

//Variable Global 
let Mychart

//Import Chart.js 
import Chart from "https://cdn.jsdelivr.net/npm/chart.js/auto/+esm";
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Bp Test >>> Changement de jour
BpTest.addEventListener("click", async() => {
    const DateActu = new Date();
    DateActu.setDate(NumJourBpTest.value);
    let DateRecacl = 0;

    TabJour.forEach((Tab) => {

        DateRecacl = new Date(Tab.dateTri).setDate(NumJourBpTest.value-1);
        Tab.dateTri = new Date(DateRecacl).toISOString();

    });

    ChangementJour();


    await setDoc(doc(db, "GlobalData", "Preference"), {
        JourSemaineDataSaved: DateActu.getDate()-1
    })
    NumJourBpTest.value = 0;
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//ChoixJour Visualisation Historique
BpJourHistoMoins.addEventListener("click", () => {
    if (TabAnnee.length != IndexChoixVisuJourHisto) {
    IndexChoixVisuJourHisto ++;
    VisuTabJour(TabJour, false);
    };
})
BpJourHistoPlus.addEventListener("click", () => {
    if (IndexChoixVisuJourHisto > 0){
    IndexChoixVisuJourHisto--;
    VisuTabJour(TabJour, false);
    };
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Changement Page
window.showTab = async function(Page) {
    const tabs = document.querySelectorAll(".Tab");
    tabs.forEach(tab => {
        tab.style.display = tab.id === Page ? "block" : "none";
    })

    if(Page != "Historique") {
        ChoixJourHisto.textContent = IndexChoixVisuJourHisto = 0
    } else VisuTabJour(TabJour, false);
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

    AffGraphique(Page)
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Ajout ligne dans tableau jour
async function AddLigneTabJour(Type) {
    const DateActuString = new Date().toISOString();
    const DateActuStringHour = new Date().getHours().toString().padStart(2, "0");
    const DateActuStringMinute = new Date().getMinutes().toString().padStart(2, "0");
    const DateActuStringSeconde = new Date().getSeconds().toString().padStart(2, "0");
    const DateActuStringComplet = `${DateActuStringHour} : ${DateActuStringMinute}`
    const MyId = `Ajout${DateActuString}`;

    //Ecriture Ligne Bdd
    await setDoc(doc(db, "TabJour", MyId), {
        date : DateActuStringComplet,
        dateTri: DateActuString,
        type : Type
    })
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
    const AjourLigneDateStringComplet = `${AjourLigneDateStringHour} : ${AjourLigneDateStringMinute}`

    //Ecriture Ligne Bdd
    await setDoc(doc(db, "TabJour", `Ajout${AjourLigneDateString}`), {
        date : AjourLigneDateStringComplet,
        dateTri: AjourLigneDateString,
        type : "C"
    })

    VisuTabJour(TabJour, true);
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Gestion Affichage Graphique Semaine / mois / année
function AffGraphique(Periode) {
    const Graphique = document.getElementById('MyChart');
    const DateActu = new Date();
    let JourActu = DateActu.getDay();
        if (JourActu == 0) JourActu = 7

    let Data = [0, 0, 0, 0, 0, 0, 0];
    let Label = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    const NbrJouraRecup = JourActu-1;

    //Maj Data avec jour actu
    Data[JourActu-1] = TabJour.length;

    //Récuperation Data
    TabAnnee.forEach(Tab => {
        Data[Tab.NumJourSemaine-1] = Tab.TableauJour.length
    })

    //Création graphique si non existant
    if (Graphique.style.display == "") {
        Mychart = new Chart(Graphique, {
            id: 0,
            type: 'bar',
            data: {
                labels: Label,
                datasets: [{
                    label: "NbrC",
                    data: Data
                }],
            },
        });
    } 
    Mychart.data.datasets[0].labels = Label;
    Mychart.data.datasets[0].data = Data;
    Mychart.update();
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Gestion Tableau historique
async function VisuTabJour(Data, RecalcRecord) {
    const tbody = document.getElementById("TabVisuJour");
    TabJourHtml.innerHTML ="";
    let ResultatRecord = 0;
    let RecordActu =0;

    //Choix jour visu tableau
    if (IndexChoixVisuJourHisto != 0 && TabAnnee[TabAnnee.length - (IndexChoixVisuJourHisto)]?.TableauJour != undefined) {
        Data = TabAnnee[TabAnnee.length - (IndexChoixVisuJourHisto)].TableauJour
    }

    ChoixJourHisto.textContent = IndexChoixVisuJourHisto;

    //Création tableau
    Data.forEach((ligne, index) => {

        if (ligne.date != undefined) {

        const tr = document.createElement("tr");

        //Index
        const tdIndex = document.createElement("td");
        tdIndex.textContent = (Data.length-index);
        
        //Date
        const tdDate = document.createElement("td");
        tdDate.textContent = ligne.date;

        //Calcul Intervalle
        const tdIntervalle = document.createElement("td");
        let DateSeconde = 0;
                
        if (index==Data.length-1) {
            for (let indexFor = (TabAnnee.length-(IndexChoixVisuJourHisto+1)); indexFor >= 0; indexFor--) {

                //Recherche dernière date dans tableau Année
                if (TabAnnee[indexFor]?.TableauJour?.[0]?.dateTri != undefined) {
                    
                DateSeconde = Math.floor((new Date(Data[index].dateTri) 
                    - new Date(TabAnnee[indexFor].TableauJour[0].dateTri)) / 1000);
                break;
                }

                //Aucune date dans tableau Année
                if (indexFor == 0) DateSeconde = 0;
            }

        } else {
            DateSeconde = Math.floor((new Date(Data[index].dateTri) - new Date(Data[index+1].dateTri)) / 1000);
        }

        //Recuperation Intervalle Maxi journée pour Record
        if (ResultatRecord<DateSeconde) ResultatRecord=DateSeconde;

        const Interheure = Math.floor((DateSeconde) / 3600);
        const Interminute = Math.floor((DateSeconde % 3600) / 60);
        const InterSeconde = DateSeconde % 60;
        const intervalle = `${Interheure} h ${Interminute} min`;
        tdIntervalle.textContent = intervalle;

        //Bp Suppression ligne
        const tdBtn = document.createElement("td");
        const btn = document.createElement("button");
        btn.textContent = "❌";

        btn.onclick =  () => {
            SupprimerLigne(ligne.id, index)
        };

        tdBtn.appendChild(btn);
        tr.appendChild(tdIndex);
        tr.appendChild(tdDate);
        tr.appendChild(tdIntervalle);
        tr.appendChild(tdBtn);
        TabJourHtml.appendChild(tr);
    };
})

    //Recalcule du record apres changement tabAnnee
    let CalcInter = 0;
    const ChgmtEnCours = localStorage.getItem("ChgmtJourEnCours")

    if (RecalcRecord == true && ChgmtEnCours != true) {

        TabAnnee.forEach((TabA, indexA) => {
            TabA.TableauJour.forEach((TabJ, index) => {
                //Calcule des intervalles entres cigs
                if (index != TabA.TableauJour.length-1 && TabA.TableauJour?.[index+1] != undefined) {
                    CalcInter = Math.floor(new Date(TabJ.dateTri) - new Date(TabA.TableauJour[index+1].dateTri)) / 1000

                } else if (TabAnnee[indexA+1]?.TableauJour?.[0] != undefined){
                    CalcInter = Math.floor(new Date(TabJ.dateTri) - new Date(TabAnnee[indexA+1].TableauJour[0].dateTri)) / 1000
                
                } else {
                    CalcInter =0;
                }

                //Recupération intervalle maxi annee pour record

                if (ResultatRecord < CalcInter) ResultatRecord = CalcInter;

            })
        })

    } else {
        RecordActu = Record.RecIntervalle;
    }

    //Ecriture Nouveau record intervalle dans BDD
    if (RecordActu < ResultatRecord && ResultatRecord != Record.RecIntervalle) {
        console.log("Ecriture Nouveau record dans BDD")
        await setDoc(doc(db, "GlobalData", "Record"), {
            RecIntervalle: ResultatRecord
        })
    }
    
    localStorage.setItem("TabJourLocal", JSON.stringify(Data))
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function SupprimerLigne(id, IndexA) {
    //Choix Tableau selon index visu
    let TabJourInter = [];

    //Jour Actu

    if (IndexChoixVisuJourHisto == 0) {
        await deleteDoc(doc(db, "TabJour", id));
        VisuTabJour(TabJour, true);
            
    //Jour Dans Tab Annee
    } else {
        const NewTabJour = TabAnnee[TabAnnee.length - IndexChoixVisuJourHisto].TableauJour.filter((val, index) => index !==IndexA);
        await updateDoc (doc(db, "TabAnnee", TabAnnee[TabAnnee.length - IndexChoixVisuJourHisto].id), {
            TableauJour: NewTabJour
        })
    }

    


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

    //Calcule Intervalle en seconde
    if (TabJour.length !=0) {
        LastDate = new Date(TabJour[0].dateTri);
        intervalleSeconde = Math.floor((DateActu - LastDate) / 1000);


    } else if (TabAnnee.length !=0) {
        for (let index = TabAnnee.length-1; index >= 0; index--) {
            if (TabAnnee[index]?.TableauJour?.[0]?.dateTri != undefined) {

            LastDate = new Date(TabAnnee[index].TableauJour[0].dateTri);
            intervalleSeconde = Math.floor((DateActu - LastDate) / 1000);
            break;
            }
        }
    }

    const ReccordInter = Record.RecIntervalle;

    //Affichage Intervalle denière fum

    localStorage.setItem("intervalleSeconde", intervalleSeconde);
    IntervalleCig.textContent = await calcAffDate(intervalleSeconde)

    //Affichage Reccord Interval
    if (intervalleSeconde >= ReccordInter || (TabJour.length == 0 && TabAnnee.length == 0)) {
        SpanRecordIntervalleCig.textContent = await calcAffDate(intervalleSeconde);
    } else if (SpanRecordIntervalleCig.textContent != ReccordInter){
        SpanRecordIntervalleCig.textContent = await calcAffDate(ReccordInter)

    };

    //Changement de jour
    const JourActu = DateActu.getDate()
    const MemChgmtJourEnCours = JSON.parse(localStorage.getItem("MemChgmtJour"))

   if (Preference.JourSemaineDataSaved != JourActu && !MemChgmtJourEnCours) {
    localStorage.setItem("MemChgmtJour", JSON.stringify(true));
    await ChangementJour();
    localStorage.setItem("MemChgmtJour", JSON.stringify(false));
   }

    }, 1000);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Changement De Jour
async function ChangementJour () {
    const JourActu = new Date().getDate();
    const DateActuString = new Date().toISOString();
    let DateTri = 0;
    if (TabJour[0]?.dateTri != undefined) {
        DateTri = TabJour[0]?.dateTri
    } else 
        DateTri = new Date().getDate()-1;

    const SousJour = new Date(DateTri);
    //SousJour.setDate(SousJour.getDate()-1);
    const MyId = `${SousJour.toISOString()}`;

    //Ecriture ligne Jour Semaine Bdd
    await setDoc(doc(db, "TabAnnee", MyId), {
        NumJourSemaine : SousJour.getDay(),
        TableauJour : TabJour
    })

    //Ecriture Jour date saved 
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
//Page Refresh
document.addEventListener("DOMContentLoaded", () => {
    showTab("Home");
    localStorage.setItem("MemChgmtJour", false)
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
    while (TabAnnee.length != 0) {     
    await deleteDoc(doc(db, "TabAnnee", TabAnnee[0].id));
    }

    //Raz GlobalData
    setDoc(doc(db, "GlobalData", "Record"), {
        RecIntervalle : 0,
    });

});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////