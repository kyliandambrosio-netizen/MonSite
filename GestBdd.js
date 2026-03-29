/////////////////////////////////////////////ECHANGE GOOGLE SHEET//////////////////////////
const URL = "https://script.google.com/macros/s/AKfycbzSufBqcBDh82Qu9wgK8dcwOz32gWHSw4AgvZ37hT4G-iHk-lVgwhdbprcEf-XLytJv/exec";
const AddCig = document.getElementById("Bp_AddCig");
const Cpt_CigJour = document.getElementById("Cpt_CigJour");

///////////////////////////////////////////////////////////////////////////////////////////
//Read From Google Sheets
export async function ReadataInGoogleSheets() {
  //Construction Data
  const data = {
  action: "read",
  cellule: 0,
	valeur: 0,
  };


  //Request data
  return fetch(URL, {
    method: "POST",
    body: JSON.stringify(data)
  })

  .then(res => res.json())
  .then (data => {
      return data
  })
  .catch(error => {
  });



};
 

///////////////////////////////////////////////////////////////////////////////////////////
//Write 1 cell To Google Sheets
export async function WriteOneCellInGoogleSheets(action, cellule, valeur) {
  //Construction Data
  const data = {
  action: "writeOneCell",
  cellule: cellule,
	valeur: valeur,
  };

  //Request data
  return fetch(URL, {
    method: "POST",
    body: JSON.stringify(data)
  })

  .then(res => res.text())
  .then (Valeur => {
      return Valeur
  })
  .catch(error => {
  });



};
 

///////////////////////////////////////////////////////////////////////////////////////////
//Write Range To Google Sheets
export async function WriteRangeInGoogleSheets(action, cellule, valeur, rowStart, columnStart) {
  //Construction Data
  const data = {
  action: action,
  cellule: cellule,
	valeur: valeur,
  rowStart: rowStart,
  columnStart: columnStart
  };

  //Request data
  return fetch(URL, {
    method: "POST",
    body: JSON.stringify(data)
  })

  .then(res => res.text())
  .then (Valeur => {
    console.log(data)
      return Valeur
  })
  .catch(error => {
  });



};