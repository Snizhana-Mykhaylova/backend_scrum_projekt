/**
 * @module server
 * @description Dieses Modul erstellt und konfiguriert einen Express-Server für die Verwaltungssoftware.
 */

// Express-Modul importieren
const express = require("express");
const { Router } = require("express");

// Express-Server erstellen
const server = express();

// Port für den Server festlegen
const port = 5500;

// Middleware für JSON-Verarbeitung hinzufügen
server.use(express.json());

// CORS (Cross-Origin Resource Sharing) Middleware konfigurieren
const cors = require("cors");
server.use(
  cors({
    origin: "http://localhost:3000",
    // Erlaubt nachfolgender Middleware das Überschreiben von CORS für Options-Anfragen
    preflightContinue: true,
  })
);

// CRUD-Module für Teilnehmer, Mitarbeiter, Dozenten, Kurse und Login importieren
const teilnehemrCRUD = require("./models/teilnehmerCRUD_model.js");
const mitarbeiterCRUD = require("./models/mitarbeiterCRUD_model.js");
const dozentenCRUD = require("./models/dozentenCRUD_model.js");
const kursCRUD = require("./models/kursCRUD_model.js");
const loginCRUD = require("./models/login_controller.js");

//***********************************************************************TEILNEHMER********************************************************************* */

// das ist die get damit  holt mann sein daten von database mitGET  =>  http://localhost:5500/get_teilnehmer_info
server.get("/get_teilnehmer_info", teilnehemrCRUD.getAll_teilnehmer);

// POST-Anfrage zum Einfügen eines Teilnehmers in die Datenbank
server.post("/insert_teilnehmer", teilnehemrCRUD.insert_teilnehmer);

// PUT-Anfrage zum Aktualisieren der Teilnehmer- und Kontaktinformationen anhand der ID
server.put("/update_TN/:TN_id", teilnehemrCRUD.update_TN);

// DELETE-Anfrage zum Löschen eines Teilnehmers und seiner Kontaktinformationen anhand der ID
server.delete("/delete_tn/:id", teilnehemrCRUD.teilnehemr_delete);

// GET-Anfrage zum Abrufen der Informationen eines einzelnen Teilnehmers anhand der ID
server.get("/teilnehemr_einzel/info/:E_id", teilnehemrCRUD.get_tnEinzel);


// hier mit kann man ein teilnehemr in ein gebuchte kurs hinfügen mit PUT bitte    =>     http://localhost:5500/insert_tn_buchung/7/48

server.post("/insert_tn_buchung", teilnehemrCRUD.tn_buchung_insert);

//hier mit kann mann die teilnehmer die ein bestimmte kurs besuchen rausfinden durch kurs id und prameter k_id =>  http://localhost:5500/getTN_Fbuchung   http://localhost:5500/getTN_Fbuchung?k_id=2


// GET-Anfrage zum Abrufen der Teilnehmer, die einen bestimmten Kurs besuchen, anhand der Kurs-ID
server.get("/getTN_Fbuchung/:k_id", teilnehemrCRUD.get_enzelTN_buchung);

//#endregion

//#region Mitarbeiter

// GET-Anfrage zum Abrufen der Mitarbeiterdaten von der Datenbank
server.get("/get_mitarbeiter_info", mitarbeiterCRUD.getAll_mitarbeiter);

// POST-Anfrage zum Einfügen eines Mitarbeiters in die Datenbank
server.post("/insert_mitarbeiter", mitarbeiterCRUD.insert_mitarbeiter);


// das ist für update bitttttttttte ders mitabeiters mitPUT durch id   => http://localhost:5500/update_mitarbeiter/12
server.put(
  "/update_mitarbeiter/:mitarbeiterId",
  mitarbeiterCRUD.update_mitarbeiter
);


// DELETE-Anfrage zum Löschen eines Mitarbeiters anhand der ID (muss weiter bearbeitet werden)
server.delete("/delete_mitarbeiter/:id_delete", mitarbeiterCRUD.delete_mitarbeiter);

// GET-Anfrage zum Abrufen der Informationen eines einzelnen Mitarbeiters anhand der ID
server.get("/get_mitarbeiter_info/:id", mitarbeiterCRUD.mitarbeiter_Einzel_info);

//#endregion

//#region Dozent

// POST-Anfrage zum Hinzufügen eines neuen Dozenten
server.post("/insert_dozent_into", dozentenCRUD.insert_dozent);

// GET-Anfrage zum Abrufen von Dozenteninformationen mit Kontaktdaten von der Datenbank
server.get("/getAll_dozent_info", dozentenCRUD.getAll_dozent_info);

// PUT-Anfrage zum Aktualisieren von Dozenten- und Kontaktinformationen anhand der ID
server.put("/update_dozent/:id", dozentenCRUD.update_dozent);

// DELETE-Anfrage zum Löschen eines Dozenten und seiner Kontaktinformationen anhand der ID
server.delete("/delete_dozent/:id", dozentenCRUD.delete_dozent);


// // hier mit kann man die einbestimmt dozent in ein bestimmt kurs hinfügen   =>                                                                                                                                                                                     die 6 ist dozent id und 7 die kurs id

server.post("/dozent_intoKurs/:id/:kurs_id", dozentenCRUD.delete_dozent_kurs);

// GET-Anfrage zum Abrufen der Informationen eines einzelnen Dozenten anhand der ID
server.get("/get_one_dozent/:id", dozentenCRUD.get_one_dozent);

//#endregion


// damit kann mann alle kurse info aufrufen                      =>    http://localhost:5500/getAll_kurs
server.get("/getAll_kurs_info", kursCRUD.getAll_kurs);


// GET-Anfrage zum Abrufen aller Kursinformationen von der Datenbank
server.get("/getAll_kurs_info", kursCRUD.getAll_kurs);


// damit kann mann beteímmte kurse info mit id                       =>    http://localhost:5500/get_one_kurs
server.get("/get_one_kurs/:id", kursCRUD.get_one_kurs);

// löschen des kurses                                       =>     http://localhost:5500/delete_kurs

server.delete("/delete_kurs/:id", kursCRUD.delete_kurs);

// POST-Anfrage zum Hinzufügen eines neuen Kurses
server.post("/insert_kurs", kursCRUD.insert_kurs);

// POST-Anfrage zum Hinzufügen eines Kurses zu den Buchungen
server.post("/inserK_buchung/:id/:id_k", kursCRUD.inserK_buchung);

//#endregion

//#region login

// POST-Anfrage zum Benutzerlogin
server.post("/login", loginCRUD.getUserLogin);

// POST-Anfrage zum Benutzer-Registrieren
server.post("/singup", loginCRUD.checkUndAddUsersingup);

//#endregion

// Server starten und auf dem angegebenen Port lauschen
server.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});

// Testbereich
module.exports = server;

