/////////////////////////////////////////////ECHANGE GOOGLE SHEET//////////////////////////
const URL = "https://script.google.com/macros/s/AKfycbztjnz7Vu2Kkr1rHX6sshZBJnhmescISNwIvgB-M2jkbL1ZJXkY8TIwqIclz4O873Ky/exec";
const AddCig = document.getElementById("Bp_AddCig");
const Cpt_CigJour = document.getElementById("Cpt_CigJour");
const visuSaveEnCours = document.getElementById("VisuSaveEnCours");

let Buffer = [];
let SendEnCours = false;

///////////////////////////////////////////////////////////////////////////////////////////
//Read From Google Sheets
export async function ReadataInGoogleSheets() {
  //Construction Data
  const data = {
  action: "read",
  cellule: "A1:M200",
	valeur: 0,
  };

  visuSaveEnCours.textContent = "Chargement Données En Cours";

  //Request data
  return fetch(URL, {
    method: "POST",
    body: JSON.stringify(data)
  })

  .then(res => res.json())
  .then (data => {
      visuSaveEnCours.textContent = "";
      return data
  })
  .catch(error => {
  });



};
 
///////////////////////////////////////////////////////////////////////////////////////////
//Write Array To Google Sheets
export async function WriteRangeInGoogleSheets(action, cellule, valeur, rowStart, columnStart) {
  //Construction Data
  const data = {
  action: action,
  cellule: cellule,
	valeur: valeur,
  rowStart: rowStart,
  columnStart: columnStart
  };

  Buffer.push(data);

  if (SendEnCours) {
    return;
  }

  SendEnCours = true;
  visuSaveEnCours.textContent = "Enregistrement Données En Cours";

  while (Buffer.length > 0) {

  //Request data
  await fetch(URL, {
    method: "POST",
    body: JSON.stringify(Buffer[0])
  });

    Buffer.splice(0, 1);


};
    SendEnCours = false
    visuSaveEnCours.textContent = "";
};