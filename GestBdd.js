/////////////////////////////////////////////ECHANGE GOOGLE SHEET//////////////////////////
const URL = "https://script.google.com/macros/s/AKfycbxxTlkL6Wl3UOpp6MIsasdx-LdfoUnM1JnjE0DmTcSU_s2Oqk9BHKeDBieN5IsZLenO/exec";
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

  console.log("Read In GoogleSheets IN PROGRESS",data)

  //Request data
  return fetch(URL, {
    method: "POST",
    body: JSON.stringify(data)
  })

  .then(res => res.json())
  .then (data => {
      console.log("Read In GoogleSheets OK ||", data)
      return data
  })
  .catch(error => {
      console.log("Read In GoogleSheets FAILLED")
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

  console.log("Write 1 cell In GoogleSheets IN PROGRESS",data)

  //Request data
  return fetch(URL, {
    method: "POST",
    body: JSON.stringify(data)
  })

  .then(res => res.text())
  .then (Valeur => {
      console.log("Write 1 cell In GoogleSheets OK")
      return Valeur
  })
  .catch(error => {
      console.log("Write 1 cell In GoogleSheets FAILLED")
  });



};
 

///////////////////////////////////////////////////////////////////////////////////////////
//Write Range To Google Sheets
export async function WriteRangeInGoogleSheets(action, cellule, valeur) {
  //Construction Data
  const data = {
  action: "writeRange",
  cellule: cellule,
	valeur: [valeur],
  };

  console.log("Write Range In GoogleSheets IN PROGRESS",data)

  //Request data
  return fetch(URL, {
    method: "POST",
    body: JSON.stringify(data)
  })

  .then(res => res.text())
  .then (Valeur => {
      console.log("Write Range In GoogleSheets OK")
      return Valeur
  })
  .catch(error => {
      console.log("Write Range In GoogleSheets FAILLED")
  });



};