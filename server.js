const express = require("express");
const server = express();
const port = 5500;
server.use(express.json());
var cors = require("cors");
const pool =require("./VSS_DatabaseConnect")

server.use(
  cors({
    origin: "http://localhost:3000",
    // Allow follow-up middleware to override this CORS for options
    preflightContinue: true,
  })
);

//***********************************************************************TEILNEHMER********************************************************************* */


// damit kann man die teilnehmer an ein kurs hinhügen mitPOST dutch id  =>  http://localhost:5500/add_TN_teilnehmer_intoBuchungen/5
// const add_TN = require("./teilnehmerCRUD_model");
// server.use("/add_TN_teilnehmer_intoBuchungen", add_TN);

// das ist die get damit  holt mann sein daten von database mitGET  =>  http://localhost:5500/get_teilnehmer_info
const get_TN_info = require("./teilnehmerCRUD_model");
server.use("/get_teilnehmer_info", get_TN_info);

// das ist die get damit  holt mann sein daten von database mitpost  =>  http://localhost:5500/insert_teilnehmer
const insert_TN = require("./teilnehmerCRUD_model");
server.use("/insert_teilnehmer", insert_TN);

// update teilnehmer und sein kontakt daten    mit id und put             =>  http://localhost:5500/update_TN/6
const update_TN = require("./teilnehmerCRUD_model");
server.use("/update_TN", update_TN);

// löschen der teilnehmer und seine kontak daten mitDELETE durch sein di =>   http://localhost:5500/delete_tn/8
const delete_TN = require("./teilnehmerCRUD_model");
server.use("/delete_tn", delete_TN);


//teilnehmer einzel info durch id aufrufen
const teilnehemr_einzel = require("./teilnehmerCRUD_model");
server.use("/teilnehemr_einzel", teilnehemr_einzel);


// hier mit kann man ein teilnehemr in ein gebuchte kurs hinfügen mit PUT bitte    =>     http://localhost:5500/insert_tn_buchung/7/48
const tn_buchung =require("./teilnehmerCRUD_model");
server.use("/insert_tn_buchung" ,tn_buchung)
//******************************************************************************************************************************************** */





//***********************************************************************MITARBEITER********************************************************************* */

// das ist die get damit  holt mann sein daten von database mitGET  =>  http://localhost:5500/get_mitarbeiter_info
const get_mitarbeiter_info = require("./mitarbeiterCRUD_model");
server.use("/get_mitarbeiter_info", get_mitarbeiter_info);

// nur insert mitarbeiter mitPOST                                     =>       http://localhost:5500/insert_mitarbeiter
const insert_mitarbeiter = require("./mitarbeiterCRUD_model");
server.use("/insert_mitarbeiter", insert_mitarbeiter);

// das ist für update bitttttttttte ders mitabeiters mitPUT durch id   => http://localhost:5500/update_mitarbeiter/12
const update_mitarbeiter = require("./mitarbeiterCRUD_model");
server.use("/update_mitarbeiter", update_mitarbeiter);

// Löschen duch die id muss aber weiter bearbeitet durch id           => http://localhost:5500/delete_mitarbeiter/9
const delete_mitarbeiter = require("./mitarbeiterCRUD_model");
server.use("/delete_mitarbeiter", delete_mitarbeiter);

//***************************************************************************************************************************************************** */

//***********************************************************************Dozent********************************************************************* */

// neu dozent zu anlegen        =>       http://localhost:5500/insert_dozent
const insert_id = require("./dozentenCRUD_model");
server.use("/insert_dozent", insert_id);

// hiermit kann man dozent info mit kontakt daten von database holen      =>     http://localhost:5500/get_dozent/getAll
const get_dozent_info = require("./dozentenCRUD_model");
server.use("/get_dozent", get_dozent_info);

// hiermit kann man dozent und sein kontakt daten updaten      =>     http://localhost:5500/dozent_update/30
const dozent_update = require("./dozentenCRUD_model");
server.use("/dozent_update", dozent_update);

// dozent und sein kontakt daten zu löschen                    =>      http://localhost:5500/delete_dozent/8
const delete_dozent = require("./dozentenCRUD_model");
server.use("/delete_dozent", delete_dozent);

// hier mit kann man die einbestimmt dozent in ein bestimmt kurs hinfügen   => http://localhost:5500/dozent_buchung/6/7    die 6 ist dozent id und 7 die kurs id
const dozent_zum_Buchung_insert = require("./dozentenCRUD_model");
server.use("/dozent_buchung", dozent_zum_Buchung_insert);


// // mit mit kann mann dozent und sein kontakt daten aufrufun durch id   => http://localhost:5500/get_one_dozent/get_one/8
const get_one = require("./dozentenCRUD_model");
server.use("/get_one_dozent" , get_one)

//***********************************************************************KURS********************************************************************* */

// insert ein neu kurs                                      =>      http://localhost:5500/insert_kurs
const inert_kurs = require("./kursCRUD_model");
server.use("/insert_kurs", inert_kurs);

// update kurs                                             =>      http://localhost:5500/update_kurs
const update_kurs = require("./kursCRUD_model");
server.use("/update_kurs", update_kurs);

// löschen des kurses                                       =>     http://localhost:5500/delete_kurs
const delete_kurs = require("./kursCRUD_model");
server.use("/delete_kurs", delete_kurs);

// damit kann mann alle kurse info aufrufen                =>          http://localhost:5500/getAll_kurs
const getAll_kurs = require("./kursCRUD_model");
server.use("/getAll_kurs", getAll_kurs);


// insert kurs zum buchung                                  =>       http://localhost:5500/kurs_buchen
const kurs_buchung = require("./kursCRUD_model");
server.use("/kurs_buchen", kurs_buchung)

//******************************************************************************************************************************************** */

//***********************************************************************login ********************************************************************* */

// das ist nur zum login muss auch in die login_contrller der weg zum home und login panal eingeben  =>  http://localhost:5500
const getUserLogin = require("./login_controller");
server.use("/", getUserLogin);

const checkUndAddUsersingup = require("./login_controller");
server.use("/", checkUndAddUsersingup);


//******************************************************************************************************************************************** */

server.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});

// npm i g-nodemon damit der server

//******************************************************************************************************************************************** */
// test aera 


//hier mit kann mann die teilnehmer die ein bestimmte kurs besuchen rausf finden durch kurs id und prameter k_id =>  http://localhost:5500/getTN   http://localhost:5500/getTN?k_id=2      
const get_tn_f_k =require("./teilnehmerCRUD_model");
server.use("/getTN" , get_tn_f_k)