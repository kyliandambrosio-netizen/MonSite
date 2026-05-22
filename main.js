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
        localStorage.setItem("RecordLoaded", true)
    })

    /////////////////////////////////////////////
    //Chargement collection GlobalData Preference
    onSnapshot(doc(db, "GlobalData", "Preference"), snapshot => {
        Preference = snapshot.data();

        //Refresh Object Html
        ParamIntervalle.value = `${Preference.IntervalleVoulu[0]}:${Preference.IntervalleVoulu[1]}`;
        ParamNbrSemaine.value = Preference.NbrMoyVoulu;
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
    if (localStorage.getItem("TabAnneeLoaded") == "true") VisuTabJour(TabJour, false)
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
    AffDateActu()

    localStorage.setItem("TabAnneeLoaded", true)
    })
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Affichage Date Actuelle
function AffDateActu() {
    const JourLettreActu = new Date().toLocaleDateString("fr-FR", { weekday: "long"});
    const JourActu = new Date().getDate().toString().padStart(2, "0");
    let MoisCalcActu = new Date();
    MoisCalcActu.setMonth(new Date().getMonth()+1)
    const MoisActu = new Date(MoisCalcActu).getMonth().toString().padStart(2, "0");
    const AnneeActu = new Date().getFullYear();
    const DateActu = `${JourLettreActu} <br> ${JourActu} / ${MoisActu} / ${AnneeActu}`
    VisuJourActuUi.innerHTML = DateActu;

}

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
const BpJourHistoPlus = document.getElementById("BpChoixJourPlus");
const BpJourHistoMoins = document.getElementById("BpChoixJourMoins");
const ChoixJourHisto = document.getElementById("ChoixJourVisuTableau");
const JourChoixJourHisto = document.getElementById("JourChoixJourVisuTableau");
const ParamIntervalle = document.getElementById("ParamIntervalle");
const BpParamIntervalle = document.getElementById("BpValideParamIntervale");
const ParamNbrSemaine = document.getElementById("ParamNbrSemaine");
const BpParamNbrSemaine = document.getElementById("BpValideParamNbrSemaine");
const BpChoixAnalyseSem = document.getElementById("BpChoixAnalyseSem");
const BpChoixAnalyseMois = document.getElementById("BpChoixAnalyseMois");
const BpChoixAnalyseAnn = document.getElementById("BpChoixAnalyseAnn");
const VisuJourActuUi = document.getElementById("JourActuelle");
const ChoixVisuGraph = document.getElementById("VisuGraph");
const BpCreationJour = document.getElementById("BpValideCreeJour");
const JourCreeManu = document.getElementById("JourCreeManu");

let IndexChoixVisuJourHisto = 0;

//Variable Global 
let Mychart

//Import Chart.js 
import Chart from "https://cdn.jsdelivr.net/npm/chart.js/auto/+esm";
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
    localStorage.setItem("ChoixPeriodeGraph", Page);
    localStorage.setItem("IndexVisuGraphique", 0)

    //Visualisation choix analyse en cours 
    switch (Page) {
        case "AnalyseSemaine":
            BpChoixAnalyseSem.style.backgroundColor = "lightgreen";
            BpChoixAnalyseMois.style.backgroundColor = "white";
            BpChoixAnalyseAnn.style.backgroundColor = "white";
            break;

        case "AnalyseMois":
            BpChoixAnalyseSem.style.backgroundColor = "white";
            BpChoixAnalyseMois.style.backgroundColor = "lightgreen";
            BpChoixAnalyseAnn.style.backgroundColor = "white";
            break;

        case "AnalyseAnnee":
            BpChoixAnalyseSem.style.backgroundColor = "white";
            BpChoixAnalyseMois.style.backgroundColor = "white";
            BpChoixAnalyseAnn.style.backgroundColor = "lightgreen";
            break;
    
        default:
            BpChoixAnalyseSem.style.backgroundColor = "white";
            BpChoixAnalyseMois.style.backgroundColor = "white";
            BpChoixAnalyseAnn.style.backgroundColor = "white";
            break;
    }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
    let AjoutLigneDate = 0;
    if (IndexChoixVisuJourHisto == 0) {
        AjoutLigneDate = new Date();

    } else if (!TabAnnee[TabAnnee.length - IndexChoixVisuJourHisto]?.TableauJour?.[0]) {
        AjoutLigneDate = new Date(TabAnnee[TabAnnee.length - IndexChoixVisuJourHisto].id);

    } else if(IndexChoixVisuJourHisto != 0)  {
        AjoutLigneDate = new Date(TabAnnee[TabAnnee.length - IndexChoixVisuJourHisto].TableauJour[0].dateTri);
    }

    const [HeureUser, MinuteUser] = AjoutLigneManu.value.split(":");

    AjoutLigneDate.setHours(HeureUser, MinuteUser, 0);

    const AjourLigneDateString = new Date(AjoutLigneDate).toISOString();
    const AjourLigneDateStringHour = new Date(AjoutLigneDate).getHours().toString().padStart(2, "0");
    const AjourLigneDateStringMinute = new Date(AjoutLigneDate).getMinutes().toString().padStart(2, "0");
    const AjourLigneDateStringSeconde = new Date(AjoutLigneDate).getSeconds().toString().padStart(2, "0");
    const AjourLigneDateStringComplet = `${AjourLigneDateStringHour} : ${AjourLigneDateStringMinute}`

    //Ecriture Ligne Bdd
        //Jour actu
    if (IndexChoixVisuJourHisto == 0) {
        await setDoc(doc(db, "TabJour", `Ajout${AjourLigneDateString}`), {
            date : AjourLigneDateStringComplet,
            dateTri: AjourLigneDateString,
            type : "C"
        })

        //Jour dans TabAnnee
    } else {
        let TabAnneeInter = TabAnnee[TabAnnee.length - IndexChoixVisuJourHisto].TableauJour;
        TabAnneeInter.push({
            date : AjourLigneDateStringComplet,
            dateTri: AjourLigneDateString,
            id : `Ajout${AjourLigneDateString}`,
            type : "C"
        })
        
        TabAnneeInter.sort((a, b) => new Date(b.dateTri) - new Date(a.dateTri));
        await updateDoc (doc(db, "TabAnnee", TabAnnee[TabAnnee.length - IndexChoixVisuJourHisto].id), {
            TableauJour: TabAnneeInter
        })
    }

    VisuTabJour(TabJour, true);
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Gestion Affichage Graphique Semaine / mois / année
async function AffGraphique(Periode, IndexVisuPeriode) {
    if (IndexVisuPeriode == undefined) IndexVisuPeriode = 0;
    const Graphique = document.getElementById('MyChart');
    const DateActu = new Date();
    let JourActu = 0
    let Data = [];
    let Label = [];
    let index = 0;
    let JourMois = 0;
    let Mois = 0;
    let Annee = 0;
    let AnActu = 0;
    let MinTab = 0;
    let MaxTab = 15; 
    let StepTab = 5;
    let DateJourStop = 0;
    let DateJourStart = 0;
    let LigneStop = 0;
    let LigneStart = 0;
    const MoisActu = new Date().getMonth();
    const AnneeActu = new Date().getFullYear();

    switch (Periode) {
        case "AnalyseSemaine":
            Data = [0, 0, 0, 0, 0, 0, 0];
            Label = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
            JourActu = DateActu.getDay();
                if (JourActu == 0) JourActu = 7

            //Maj Data avec jour actu
            Data[JourActu-1] = TabJour.length;

            
            //Recherche ligne start/stop
            LigneStart = TabAnnee.length-1;
            LigneStop = (LigneStart-(JourActu-1));
            if ( IndexVisuPeriode != 0) {
                LigneStart = LigneStop - (7 * (IndexVisuPeriode-1));
                LigneStop = LigneStart - 7;
            }

            if (LigneStart < 0) {
                localStorage.setItem("FinDataGraphique", true);
                IndexVisuPeriode --;
                LigneStart = LigneStop - (7 * (IndexVisuPeriode-1));
                LigneStop = LigneStart - 7;
            } else if(LigneStop < 0) {
                localStorage.setItem("FinDataGraphique", true);
                LigneStop = -1;
            } else {
                localStorage.setItem("FinDataGraphique", false)
            }

            //Récuperation Data Tab Annee
            DateJourStop = TabAnnee[LigneStop+1].id;
            DateJourStart = TabAnnee[LigneStart].id;

            for (let index = LigneStart; index > LigneStop; index--) {
                if (TabAnnee[index]?.TableauJour[0]?.dateTri && index >= 0) {
                    let JourCalc = new Date(TabAnnee[index].TableauJour[0]?.dateTri).getDay();
                        if (JourCalc == 0) JourCalc = 7   

                    Data[JourCalc-1] = TabAnnee[index].TableauJour.length
                }
            }

            //Bornage Y graphique
            MinTab = 0;
            MaxTab = 15; 
            StepTab = 5; 
            break;

        case "AnalyseMois":

            //Recherche ligne start/stop
            JourActu = new Date().getDate();
            LigneStart = TabAnnee.length-1;
            LigneStop = (LigneStart-(JourActu-1));
            if ( IndexVisuPeriode != 0) {
                LigneStart = LigneStop - (31 * (IndexVisuPeriode-1));
                LigneStop = LigneStart - 31;
            }
  

            if (LigneStart < 0) {
                localStorage.setItem("FinDataGraphique", true);
                IndexVisuPeriode --;
                LigneStart = LigneStop - (7 * (IndexVisuPeriode-1));
                LigneStop = LigneStart - 7;
            } else if(LigneStop < 0) {
                localStorage.setItem("FinDataGraphique", true);
                LigneStop = -1;
            } else {
                localStorage.setItem("FinDataGraphique", false)
            }


            //Initialisation Graph
            for (let index = 1; index <= 31; index++) {Label[index] = index}

            //Jour Actu
            if (IndexVisuPeriode == 0) Data[new Date().getDate()] = TabJour.length;

            //Récuperation Data Tab Annee
            DateJourStop = TabAnnee[LigneStop+1].id;
            DateJourStart = TabAnnee[LigneStart].id;

             for (let index = LigneStart; index > LigneStop; index--) {
                if (TabAnnee[index]?.TableauJour[0]?.dateTri && index >= 0) {
                    const IndexData = new Date(TabAnnee[index].id).getDate();
                    Data[IndexData] = TabAnnee[index].TableauJour.length
                }
            }


            //Bornage Y graphique
            MinTab = 0;
            MaxTab = 15; 
            StepTab = 5; 

            break;

        case "AnalyseAnnee":

            //Récuperation Data Tab Annee
            for (let index = 1; index <= 12; index++) {
                let NbrCigMois = 0;

                Label[index-1] = index

                TabAnnee.forEach((Tab) => {
                    Mois = new Date(Tab.TableauJour[0]?.dateTri).getMonth() || 0;
                    const Annee = new Date(Tab.TableauJour[0]?.dateTri).getFullYear() || 0;
                    if (Mois == index && Annee == AnneeActu) NbrCigMois += Tab.TableauJour.length

                })

                if (index == MoisActu) NbrCigMois += TabJour.length

                Data[index] = NbrCigMois;
            }

            //Bornage Y graphique
            MinTab = 0;
            MaxTab = 300; 
            StepTab = 75; 

            break;
    }

    //Création graphique si non existant
    if (Graphique.style.display == "") {
        Mychart = new Chart(Graphique, {
            id: 0,
            type: 'bar',
            data: {
                labels: Label,
                datasets: [{
                    label: "NbrC",
                    data: Data,
                    backgroundColor: "red",
                    color: "white"
                }],
            },
            options : {
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        min: MinTab,
                        max: MaxTab,
                        ticks: {
                            stepSize : StepTab,
                            color: "aquamarine",
                            font: {
                                size: 40
                            }
                        },
                        grid:{
                            color: "aquamarine"
                        }
                    },

                    x: {
                        ticks: {
                            color: "aquamarine",
                            font:{
                                size: 40
                            }
                        }
                    }
                }
            }
        });
    } else {
        Mychart.data.labels = Label;
        Mychart.data.datasets[0].data = Data;
        Mychart.options.scales.y.max = MaxTab
        Mychart.options.scales.y.ticks.stepSize = StepTab
        Mychart.resize();
        Mychart.update();
    }

    //Affichage intervalle semaine selectionnée
    const DateJourStopJ = new Date(DateJourStop).getDate().toString().padStart(2, "0");
    const DateJourStopM = new Date(DateJourStop).getMonth().toString().padStart(2, "0");
    const DateJourStopA = new Date(DateJourStop).getFullYear().toString().slice(-2);
    const DateJourStartJ = new Date(DateJourStart).getDate().toString().padStart(2, "0");
    const DateJourStartM = new Date(DateJourStart).getMonth().toString().padStart(2, "0");
    const DateJourStartA = new Date(DateJourStart).getFullYear().toString().slice(-2);

    ChoixVisuGraph.textContent = `${DateJourStopJ}/${DateJourStopM}/${DateJourStopA} > ${DateJourStartJ}/${DateJourStartM}/${DateJourStartA}`

    //Calcule Moyenne
    Moyenne(Periode)
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Gestion Tableau historique
async function VisuTabJour(Data, RecalcRecord) {
    const tbody = document.getElementById("TabVisuJour");
    TabJourHtml.innerHTML ="";
    let ResultatRecord = 0;
    let RecordActu =0;
    let DateVisu = 0;

    //Choix jour visu tableau
    if (IndexChoixVisuJourHisto != 0 && TabAnnee[TabAnnee.length - (IndexChoixVisuJourHisto)]?.TableauJour?.[0] != undefined) {
        Data = TabAnnee[TabAnnee.length - (IndexChoixVisuJourHisto)].TableauJour
        DateVisu = TabAnnee[TabAnnee.length - (IndexChoixVisuJourHisto)].TableauJour[0].dateTri;
        ChoixJourHisto.textContent = `${new Date(DateVisu).getDate().toString().padStart(2, "0")} / ${(new Date(DateVisu).getMonth()+1).toString().padStart(2, "0")} 
                                        / ${new Date(DateVisu).getFullYear()}`;
        JourChoixJourHisto.textContent = `${new Date(DateVisu).toLocaleDateString("fr-FR", { weekday: "long"})}`

    } else if (IndexChoixVisuJourHisto == 0) {
        ChoixJourHisto.textContent = `${new Date().getDate().toString().padStart(2, "0")} / ${(new Date().getMonth()+1).toString().padStart(2, "0")} 
                                        / ${new Date().getFullYear()}`;
        JourChoixJourHisto.textContent = `${new Date().toLocaleDateString("fr-FR", { weekday: "long"})}`

    } else if (TabAnnee[TabAnnee.length - (IndexChoixVisuJourHisto)]?.TableauJour?.[0] == undefined) {
        Data = [];
        DateVisu = TabAnnee[TabAnnee.length - (IndexChoixVisuJourHisto)].id;
        ChoixJourHisto.textContent = `${new Date(DateVisu).getDate().toString().padStart(2, "0")} / ${(new Date(DateVisu).getMonth()+1).toString().padStart(2, "0")} 
                                        / ${new Date(DateVisu).getFullYear()}`;
        JourChoixJourHisto.textContent = `${new Date(DateVisu).toLocaleDateString("fr-FR", { weekday: "long"})}`
    }

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

        const Interheure = (Math.floor((DateSeconde) / 3600)).toString().padStart(2, "0");
        const Interminute = (Math.floor((DateSeconde % 3600) / 60)).toString().padStart(2, "0");
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

                } else if (TabAnnee[indexA-1]?.TableauJour?.[0] != undefined){
                    CalcInter = Math.floor(new Date(TabJ.dateTri) - new Date(TabAnnee[indexA-1].TableauJour[0].dateTri)) / 1000
                
                } else {
                    CalcInter = 0;
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

        VisuTabJour(TabJour, true);
    }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function calcAffDate(DateSeconde) {
    const Interheure = Math.floor((DateSeconde) / 3600);
    const Interminute = Math.floor((DateSeconde % 3600) / 60).toString().padStart(2, "0");
    const InterSeconde = Math.round(DateSeconde % 60).toString().padStart(2, "0");
    const intervalle = `${Interheure} h ${Interminute} min ${InterSeconde} s`;
    return intervalle;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Declenchement toutes les seconde
setInterval(async () => {
    if (localStorage.getItem("TabAnneeLoaded") != "true" || localStorage.getItem("RecordLoaded") != "true") return;
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
    let [ParamInterH, ParamInterM] = ParamIntervalle.value.split(":");
    
    ParamInterH *= 3600; //Convertion heure en seconde
    ParamInterM *= 60; //Convertion Minute en seconde

    //Affichage Intervalle denière fum
    localStorage.setItem("intervalleSeconde", intervalleSeconde);
    IntervalleCig.textContent = await calcAffDate(intervalleSeconde)

    if (intervalleSeconde >= (ParamInterH + ParamInterM)) {
        IntervalleCig.style.color = "Green";
    } else {
        IntervalleCig.style.color = "Red";
    }

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
    } else {
        TabJour = [];
        DateTri = new Date().getDate()-1;
    }

    const SousJour = new Date(DateTri);
    const MyId = `${SousJour.toISOString()}`;

    //Ecriture ligne Jour Semaine Bdd
    await setDoc(doc(db, "TabAnnee", MyId), {
        TableauJour : TabJour
    })

    //Ecriture Jour date saved 
    await updateDoc(doc(db, "GlobalData", "Preference"), {
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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Gestion Parametre intervalle voulu 
BpParamIntervalle.addEventListener("click", () => {
    const [ParamInterH, ParamInterM] = ParamIntervalle.value.split(":");
    const ParamInterHInter = ParamInterH * 3600; //Convertion heure en seconde
    const ParamInterMInter = ParamInterM * 60; //Convertion Minute en seconde

    //Ecriture nouvelle data dans Bdd
    if (Preference.IntervalleVoulu != [ParamInterH, ParamInterM]) {
        updateDoc(doc(db, "GlobalData", "Preference"), {
            IntervalleVoulu : [ParamInterH, ParamInterM],
        });

        BpParamIntervalle.style.backgroundColor = "white"   
    }
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Gestion Parametre Nbr moyenne semaine voulu
BpParamNbrSemaine.addEventListener("click", () => {
    //Ecriture nouvelle data dans Bdd
    if (Preference.NbrMoySemaineVoulu != ParamNbrSemaine.value) {
        updateDoc(doc(db, "GlobalData", "Preference"), {
            NbrMoyVoulu : ParamNbrSemaine.value,
        });

        BpParamNbrSemaine.style.backgroundColor = "white"   
    }
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Visu Modification non valider Reglage > Intervalle voulu
ParamIntervalle.addEventListener("change", (e) => {
    const [ParamInterH, ParamInterM] = ParamIntervalle.value.split(":");

    if (Preference.IntervalleVoulu != [ParamInterH, ParamInterM]) {
        BpParamIntervalle.style.backgroundColor = "red"      
    }
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Visu Modification non valider Reglage > Intervalle voulu
ParamNbrSemaine.addEventListener("change", (e) => {
    if (Preference.NbrMoySemaineVoulu != ParamNbrSemaine.value) {
        BpParamNbrSemaine.style.backgroundColor = "red"      
    }
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Calcule Moyenne
function Moyenne(Periode) {
    let CalcMoyenneNbrF = TabJour.length; //Initialisation avec tableau jour actu
    let NbrDataNbrF = 0; //Initialisation avec tableau jour actu
        if (TabJour.length > 0) {NbrDataNbrF = 1};
    let CalcMoyenneInter = 0;
    let NbrDataInter = TabJour.length - 1; //Initialisation avec tableau jour actu sans la première inter de la journée
    let CalcInter = 0;
    let JourActu = new Date().getDay();
        if (JourActu == 0) JourActu = 7
    let JourMoisActu = new Date().getDate();
    let LigneStop = 0;
    let LigneStart = 0;

    //CaluleMoyenneJourActu
    TabJour.forEach((Tab, i) => {
        if (TabJour[i+1]?.dateTri && i != TabJour.length-1) {
            CalcInter = Math.floor(new Date(Tab.dateTri) - new Date(TabJour[i+1].dateTri)) / 1000
            CalcMoyenneInter += CalcInter; 
        }
    })

    switch (Periode) {
        case "AnalyseSemaine":
            LigneStop = ((TabAnnee.length-1)-(JourActu-2));
            LigneStart = (TabAnnee.length-1);
        
            break;

        case "AnalyseMois": 
            LigneStop = ((TabAnnee.length-1)-(JourMoisActu-1));
            LigneStart = (TabAnnee.length-1);

        break;

        case "AnalyseAnnee": 
            const Today = new Date();
            const Start = new Date(Today.getFullYear(), 0, 0)
            const diff = Today - Start;
            const oneDay = 1000 * 60 * 60 * 24;
            const DayOfYears = Math.floor(diff / oneDay);

            LigneStop = ((TabAnnee.length-1)-(DayOfYears-1));
                if (LigneStop < 0) LigneStop = 0;
            LigneStart = (TabAnnee.length-1);
        break;
    }

    //Calcule Nombre et intervalle dans tabAnnee
    for (let index = LigneStart; index >= LigneStop; index--) {
        if (TabAnnee[index]?.TableauJour[0]?.dateTri) {
            NbrDataNbrF ++;
            CalcMoyenneNbrF += TabAnnee[index].TableauJour.length

            TabAnnee[index].TableauJour.forEach((TabAJ, j) => {
                if (TabAnnee[index].TableauJour[j+1]?.dateTri && j != TabAnnee[index].TableauJour.length-1) {
                    CalcInter = Math.floor(new Date(TabAJ.dateTri) - new Date(TabAnnee[index].TableauJour[j+1].dateTri)) / 1000
                    CalcMoyenneInter += CalcInter; 
                    NbrDataInter ++;
                }
            })
        }
    }


    //Calcule Final + Affichage moyenne 
    const ResultatInter = CalcMoyenneInter / NbrDataInter;
    const Interheure = Math.floor((ResultatInter) / 3600).toString().padStart(2, "0");
    const Interminute = Math.floor((ResultatInter % 3600) / 60).toString().padStart(2, "0");
    const intervalle = `${Interheure} h ${Interminute} m`;
    const IntervalleActu = localStorage.getItem("intervalleSeconde")

    SpanMoyenneJourNbrF.textContent = (Math.round(CalcMoyenneNbrF / NbrDataNbrF * 10)) / 10;
    if (SpanMoyenneJourNbrF.textContent <= Preference.NbrMoyVoulu) {
        SpanMoyenneJourNbrF.style.color = "green";
    } else {
        SpanMoyenneJourNbrF.style.color = "red";
    }

    SpanMoyenneJourIntervalle.textContent = intervalle;
    if ([Interheure, Interminute] >= Preference.IntervalleVoulu) {
        SpanMoyenneJourIntervalle.style.color = "green";
    } else {
        SpanMoyenneJourIntervalle.style.color = "red";
    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Switch gauche droite graphique pour changement periode
const GraphiqueSwipe = document.getElementById("MyChart");

let StartSwipX = 0 ;

GraphiqueSwipe.addEventListener("pointerdown", (e) => {
    StartSwipX = e.clientX;
})

GraphiqueSwipe.addEventListener("pointerup", (e) => {
    let EndSwipX = e.clientX;
    let diff = StartSwipX - EndSwipX;
    let IndexVisuGraph = localStorage.getItem("IndexVisuGraphique") || 0;
    const PageActuAnalyse = localStorage.getItem("ChoixPeriodeGraph");

    //Swip droite
    if (diff > 50) {
        if (IndexVisuGraph > 0) IndexVisuGraph --;

    //Swip gauche
    } else if (diff < -50) {
        const FinDataGraphique = localStorage.getItem("FinDataGraphique")
        if (FinDataGraphique == 'false') {
            IndexVisuGraph ++; 
            
        }
                    
    }
    
    localStorage.setItem("IndexVisuGraphique", IndexVisuGraph)
    AffGraphique(PageActuAnalyse, IndexVisuGraph)
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Bouton Création Jour Manu
BpCreationJour.addEventListener("click", async() => {
    const CalcJourIsoStr = new Date(JourCreeManu.value).toISOString();

    await setDoc(doc(db, "TabAnnee", CalcJourIsoStr), {
        TableauJour:[]
    })
})
