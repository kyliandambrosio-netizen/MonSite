/////////////////////////////////////////////////SAVE GOOGLE SHEET//////////////////////////
const URL = "https://script.google.com/macros/s/AKfycbxxTlkL6Wl3UOpp6MIsasdx-LdfoUnM1JnjE0DmTcSU_s2Oqk9BHKeDBieN5IsZLenO/exec";
const AddCig = document.getElementById("Bp_AddCig");
const Cpt_CigJour = document.getElementById("Cpt_CigJour");

export async function SaveDataInGoogleSheets(action, cellule, valeur) {
  //Construction Data
  const data = {
  action: action, //read / write
  cellule: cellule,
	valeur: valeur,
  };

  console.log("Access In GoogleSheets IN PROGRESS",data)

  //Request data
  return fetch(URL, {
    method: "POST",
    body: JSON.stringify(data)
  })

  .then(response => response.text())
  .then (valeurRetour => {
      console.log("Access In GoogleSheets OK ||", valeurRetour)
      return valeurRetour
  })
  .catch(error => {
      console.log("Access In GoogleSheets FAILLED",data)
  });



};
 
