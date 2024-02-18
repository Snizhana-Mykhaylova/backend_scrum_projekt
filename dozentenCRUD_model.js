const express = require("express");
const dozentenCRUD_model = express();
const pool = require("./VSS_DatabaseConnect");

// das ist die get damit  holt mann sein daten von database

//  dozent in database anlegen
dozentenCRUD_model.post("", async (req, res) => {
  const {
    vorname,
    nachname,
    fachgebiet,
    phone,
    plz,
    ort,
    strasse,
    email,
    hause_nr,
  } = req.body;

  try {
    dozentAbfrage =
      "INSERT INTO dozenten (dozent_vorname , dozent_nachname , dozent_fachgebiet) VALUES ($1, $2,$3) RETURNING dozent_id";
    dozentWerte = [vorname, nachname, fachgebiet];
    erg = await pool.query(dozentAbfrage, dozentWerte);
    id = erg.rows[0].dozent_id;

    kontaktAbfrage =
      "INSERT INTO kontakt_daten (fk_dozent_id, kd_ort, kd_straße, kd_haus_nr, kd_plz, kd_email, kd_phone_nr) VALUES ($1, $2, $3, $4, $5, $6,$7)";
    werte = [id, ort, strasse, hause_nr, plz, email, phone];
    await pool.query(kontaktAbfrage, werte);

    res.status(201).send("dozent hinzugefügt");
  } catch (error) {
    console.error("fehler beim dozent hinzufügen");
    res.status(500).send("fehler    :(");
  }
});

// get dozent info durch get                   =>          http://localhost:5500/get_dozent
dozentenCRUD_model.get("", async (req, res) => {
  try {
    const abfrage =
      "SELECT d.* , kd.* FROM dozenten d LEFT JOIN  kontakt_daten kd ON d.dozent_id = fk_dozent_id";
    const erg = await pool.query(abfrage);

    res.json(erg.rows);
  } catch (error) {
    console.error("Fehler beim Abrufen der dozent:", error);
    res.status(500).send("Server fehler :(");
  }
});

// hier mit kann man löschen dozen und sein kontakt ddaten updaten  =>  http://localhost:5500/delete_dozent/5

dozentenCRUD_model.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    kontaktDeleteAbfrage = "DELETE FROM kontakt_daten WHERE fk_dozent_id = $1";
    await pool.query(kontaktDeleteAbfrage, [id]);

    dozentDeleteAbfrage = "DELETE FROM dozenten WHERE dozent_id = $1";
    await pool.query(dozentDeleteAbfrage, [id]);

    res.status(200).send("wurde gelöscht");
  } catch (error) {
    console.error("fehler beim dozent löschen");
    res.status(500).send("server fehler");
  }
});

dozentenCRUD_model.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    vorname,
    nachname,
    fachgebiet,
    phone,
    plz,
    ort,
    strasse,
    email,
    hause_nr,
  } = req.body;
  try {
    dozentAbfrage =
      "UPDATE dozenten SET dozent_vorname = $1, dozent_nachname = $2 , dozent_fachgebiet = $3 WHERE dozent_id = $4";
    dozentWerte = [vorname, nachname, fachgebiet, id];
    await pool.query(dozentAbfrage, dozentWerte);

    kontaktAbfrage =
      "UPDATE kontakt_daten SET kd_ort = $1, kd_straße = $2, kd_haus_nr = $3, kd_plz = $4, kd_email = $5, kd_phone_nr = $6 WHERE fk_dozent_id = $7";
    werte = [ort, strasse, hause_nr, plz, email, phone, id];
    await pool.query(kontaktAbfrage, werte);

    res.status(200).send("dozent aktualisiert");
  } catch (error) {
    console.error("Fehler beim aktualisieren des mitarbeiters:", error);
    res.status(500).send("hallo Server fehler :(");
  }
});

// hier mit kann man die einbestimmt dozent in ein bestimmt kurs hinfügen
dozentenCRUD_model.post("/:id/:kurs_id", async (req, res) => {
  const { id, kurs_id } = req.params;
  try {
    const updateQuery = "UPDATE kurse SET fk_dozent_id = $1 WHERE kurs_id = $2";
    await pool.query(updateQuery, [id, kurs_id]);
    res.status(201).send("Dozent hinzugefügt! :)");
  } catch (error) {
    console.error("Fehler beim Hinzufügen des Dozenten:", error);
    res.status(500).send("Server Fehler :(");
  }
});

module.exports = dozentenCRUD_model;
