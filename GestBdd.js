/////////////////////////////////////////////ECHANGE GOOGLE SHEET//////////////////////////
const URL = "https://script.google.com/macros/s/AKfycbzSufBqcBDh82Qu9wgK8dcwOz32gWHSw4AgvZ37hT4G-iHk-lVgwhdbprcEf-XLytJv/exec";
const AddCig = document.getElementById("Bp_AddCig");
const Cpt_CigJour = document.getElementById("Cpt_CigJour");
let Buffer = [];
let SendEnCours = false;

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
    
    console.log("deja en cours", Buffer);

    return;
  }

  SendEnCours = true;


  while (Buffer.length > 0) {
      console.log("Capasseoupas", Buffer.length, Buffer);
    console.log(Buffer[0])
  //Request data
  await fetch(URL, {
    method: "POST",
    body: JSON.stringify(Buffer[0])
  })

  .then(res => res.text())
  .then (Valeur => {
    console.log("WriteInSheetOK", data)
    Buffer.splice(0, 1);
    console.log("Capasseoupas", Buffer.length, Buffer);
    SendEnCours = false
      return Valeur
  })
  .catch(error => {
    Buffer.splice(0, 1);
          console.log("Capasseoupas", Buffer.length, Buffer);
    SendEnCours = false;
  });

};



};