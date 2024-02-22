const express = require("express");
const { Router } = require("express");
const server = express();
const port = 5500;
server.use(express.json());
var cors = require("cors");
server.use(
  cors({
    origin: "http://localhost:3000",
    // Allow follow-up middleware to override this CORS for options
    preflightContinue: true,
  })
);
const teilnehemrCRUD = require("./models/teilnehmerCRUD_model.js");
const mitarbeiterCRUD = require("./models/mitarbeiterCRUD_model.js");
const dozentenCRUD = require("./models/dozentenCRUD_model.js");
const kursCRUD = require("./models/kursCRUD_model.js");
const loginCRUD = require("./models/login_controller.js");


//***********************************************************************TEILNEHMER********************************************************************* */

// das ist die get damit  holt mann sein daten von database mitGET  =>  http://localhost:5500/get_teilnehmer_info
server.get("/get_teilnehmer_info", teilnehemrCRUD.getAll_teilnehmer);

// das ist die get damit  holt mann sein daten von database mitpost  =>  http://localhost:5500/insert_teilnehmer
server.post("/insert_teilnehmer", teilnehemrCRUD.insert_teilnehmer);

// update teilnehmer und sein kontakt daten    mit id und put             =>  http://localhost:5500/update_TN/6
server.put("/update_TN/:TN_id", teilnehemrCRUD.update_TN);

// löschen der teilnehmer und seine kontak daten mitDELETE durch sein di =>   http://localhost:5500/delete_tn/8
server.delete("/delete_tn/:id", teilnehemrCRUD.teilnehemr_delete);

//teilnehmer einzel info durch id aufrufen                             =>   http://localhost:5500/teilnehemr_einzel/info/8
server.get("/teilnehemr_einzel/info/:E_id", teilnehemrCRUD.get_tnEinzel);

// hier mit kann man ein teilnehemr in ein gebuchte kurs hinfügen mit PUT bitte    =>     http://localhost:5500/insert_tn_buchung/7/48

server.post( "/insert_tn_buchung",teilnehemrCRUD.tn_buchung_insert);

//hier mit kann mann die teilnehmer die ein bestimmte kurs besuchen rausfinden durch kurs id und prameter k_id =>  http://localhost:5500/getTN_Fbuchung   http://localhost:5500/getTN_Fbuchung?k_id=2

server.get("/getTN_Fbuchung/:k_id", teilnehemrCRUD.get_enzelTN_buchung);
//******************************************************************************************************************************************** */

//***********************************************************************MITARBEITER********************************************************************* */

// das ist die get damit  holt mann sein daten von database mitGET  =>  http://localhost:5500/get_mitarbeiter_info
server.get("/get_mitarbeiter_info", mitarbeiterCRUD.getAll_mitarbeiter);

// nur insert mitarbeiter mitPOST                                     =>       http://localhost:5500/insert_mitarbeiter
server.post("/insert_mitarbeiter", mitarbeiterCRUD.insert_mitarbeiter);

// das ist für update bitttttttttte ders mitabeiters mitPUT durch id   => http://localhost:5500/update_mitarbeiter/12
server.put("/update_mitarbeiter/:mitarbeiterId",mitarbeiterCRUD.update_mitarbeiter);

// Löschen duch die id muss aber weiter bearbeitet durch id           => http://localhost:5500/delete_mitarbeiter/9
server.delete(
  "/delete_mitarbeiter/:id_delete",
  mitarbeiterCRUD.delete_mitarbeiter
);

//   mitarbeiter_Einzel_info,                                              => http://localhost:5500/get_mitarbeiter_info/9
server.get(
  "/get_mitarbeiter_info/:id",
  mitarbeiterCRUD.mitarbeiter_Einzel_info
);

//***************************************************************************************************************************************************** */

//***********************************************************************Dozent********************************************************************* */

// neu dozent zu anlegen        =>       http://localhost:5500/insert_dozent_into
server.post("/insert_dozent_into", dozentenCRUD.insert_dozent);

// // hiermit kann man dozent info mit kontakt daten von database holen      =>     http://localhost:5500/getAll_dozent_info
server.get("/getAll_dozent_info", dozentenCRUD.getAll_dozent_info);

// // hiermit kann man dozent und sein kontakt daten updaten      =>     http://localhost:5500/update_dozent/30
server.put("/update_dozent/:id", dozentenCRUD.update_dozent);

// // dozent und sein kontakt daten zu löschen                    =>      http://localhost:5500/delete_dozent/8
server.delete("/delete_dozent/:id", dozentenCRUD.delete_dozent);

// // hier mit kann man die einbestimmt dozent in ein bestimmt kurs hinfügen   =>                                                                                                                                                                                     die 6 ist dozent id und 7 die kurs id
server.post("/dozent_intoKurs/:id/:kurs_id", dozentenCRUD.delete_dozent_kurs);                                                                                                                  

// // // mit mit kann mann dozent und sein kontakt daten aufrufun durch id   => http://localhost:5500/get_one_dozent/8
server.get("/get_one_dozent/:id", dozentenCRUD.get_one_dozent);

//***********************************************************************KURS********************************************************************* */

// damit kann mann alle kurse info aufrufen                      =>    http://localhost:5500/getAll_kurs
server.get("/getAll_kurs_info", kursCRUD.getAll_kurs);                                                                                                                                       

// update kurs                                             =>      http://localhost:5500/update_kurs
server.put("/update_kurs/:id", kursCRUD.update_kurs);


// damit kann mann beteímmte kurse info mit id                       =>    http://localhost:5500/get_one_kurs
server.get("/get_one_kurs/:id", kursCRUD.get_one_kurs);


// löschen des kurses                                       =>     http://localhost:5500/delete_kurs
server.delete("/delete_kurs/:id", kursCRUD.delete_kurs);

// // insert ein neu kurs                                  =>         http://localhost:5500/insert_kurs
server.post("/insert_kurs", kursCRUD.insert_kurs);

// // insert kurs zum buchung                                  =>       http://localhost:5500/inserK_buchung
server.post("/inserK_buchung/:id/:id_k", kursCRUD.inserK_buchung);

//******************************************************************************************************************************************** */

//***********************************************************************login ********************************************************************* */

// das ist nur zum login muss auch in die login_contrller der weg zum home und login panal eingeben  =>  http://localhost:5500

server.post("/login", loginCRUD.getUserLogin);

server.post("/singup", loginCRUD.checkUndAddUsersingup);

//******************************************************************************************************************************************** */

server.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});

//******************************************************************************************************************************************** */
// test aera
module.exports = server;

//******************************************************************************************************************************************** */
