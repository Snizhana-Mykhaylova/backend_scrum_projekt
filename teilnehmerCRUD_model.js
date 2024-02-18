const express = require("express");
const teilnehmerCRUD_model = express();
const pool = require("./VSS_DatabaseConnect");

// damit kann man die teilnehmer an ein kurs hinhügen
// teilnehmerCRUD_model.post("/:TN_id", async (req, res) => {
//   const { TN_id } = req.params;

//   try {
//     const insertQuery = "INSERT INTO buchungen (teilnehmer_fkey) VALUES ($1)";
//     await pool.query(insertQuery, [TN_id]);
//     res.status(201).send("Teilnehmer hinzugefügt! :)");
//   } catch (error) {
//     console.error("Fehler beim Hinzufügen des Teilnehmers:", error);
//     res.status(500).send("Server fehler :(");
//   }
// });

// damit kann man die ganze daten von teilnehmer aufrufren
teilnehmerCRUD_model.get("", async (req, res) => {
  try {
    const Abfrag = `
        SELECT t.*, kd.* FROM teilnehmer t LEFT JOIN kontakt_daten kd ON t.teilnehmer_id = kd.fk_teilnehmer_id;`;
    const result = await pool.query(Abfrag);

    res.json(result.rows);
  } catch (error) {
    console.error("Fehler beim Abrufen der teilnehmer:", error);
    res.status(500).send("Server fehler :(");
  }
});

//teilnehmer einzel info durch id aufrufen
teilnehmerCRUD_model.get("/:E_id", async (req, res) => {
  const { E_id } = req.params;
  try {
    selectAbfrage = "SELECT * FROM teilnehmer WHERE teilnehmer_id = $1";
    ergVonTeilnehmer = await pool.query(selectAbfrage, [E_id]);
    selectAbfrageKD = "SELECT * FROM kontakt_daten WHERE fk_teilnehmer_id = $1";
    ergVonKontaktdatne = await pool.query(selectAbfrageKD, [E_id]);
    res.json({
      teilnehmer: ergVonTeilnehmer.rows,
      kontaktDaten: ergVonKontaktdatne.rows,
    });
  } catch (error) {
    console.error("Fehler beim selektieren der teilnehmerinfo:", error);
    res.status(500).send("hau ab ist doch Server fehler");
  }
});

//damit kann die teilnehmer daten einfügen (insert)
teilnehmerCRUD_model.post("", async (req, res) => {
  const { vorname, nachname, phone, plz, ort, strasse, email, hause_nr } =
    req.body;

  try {
    teilnehmerAbfrage =
      "INSERT INTO teilnehmer (teilnehmer_vorname , teilnehmer_nachname) VALUES ($1,$2) RETURNING teilnehmer_id";
    teilnehmerWerte = [vorname, nachname];
    erg = await pool.query(teilnehmerAbfrage, teilnehmerWerte);
    id = erg.rows[0].teilnehmer_id;

    TN_KD_Abfrage =
      "INSERT INTO kontakt_daten (fk_teilnehmer_id, kd_ort, kd_straße, kd_haus_nr, kd_plz, kd_email, kd_phone_nr) VALUES ($1, $2, $3, $4, $5, $6,$7)";
    TN_KD_Werte = [id, ort, strasse, hause_nr, plz, email, phone];
    await pool.query(TN_KD_Abfrage, TN_KD_Werte);
    res.status(201).send("teilnehmer hinzugefügt!");
  } catch (error) {
    console.error("Fehler beim Hinzufügen des teilnehmer:", error);
    res.status(500).send("Interner Server fehler");
  }
});

// damit kann die teilnehmer sein daten updaten
teilnehmerCRUD_model.put("/:TN_id", async (req, res) => {
  const TN_id = req.params.TN_id;
  const { vorname, nachname, phone, plz, ort, strasse, email, hause_nr } =
    req.body;

  try {
    const teilnehmerAbfrage =
      "UPDATE teilnehmer SET teilnehmer_vorname = $1,  teilnehmer_nachname = $2 WHERE teilnehmer_id = $3";
    const teilnehmerWerte = [vorname, nachname, TN_id];
    await pool.query(teilnehmerAbfrage, teilnehmerWerte);

    const kontaktAbfrage =
      "UPDATE kontakt_daten SET kd_ort = $1, kd_straße = $2, kd_haus_nr = $3, kd_plz = $4, kd_email = $5, kd_phone_nr = $6 WHERE fk_teilnehmer_id = $7";
    const KD_Werte = [ort, strasse, hause_nr, plz, email, phone, TN_id];
    await pool.query(kontaktAbfrage, KD_Werte);

    res.status(200).send("Teilnehmer aktualisiert!");
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Teilnehmers:", error);
    res.status(500).send("Interner Serverfehler :(");
  }
});

// damit kann man die teilnehmer löschen
teilnehmerCRUD_model.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const kontaktLöschenAbfrage =
      "DELETE FROM kontakt_daten WHERE fk_teilnehmer_id = $1";
    await pool.query(kontaktLöschenAbfrage, [id]);

    const teilnehmerDeleteAbfrage =
      "DELETE FROM teilnehmer WHERE teilnehmer_id = $1";
    await pool.query(teilnehmerDeleteAbfrage, [id]);

    res.status(200).send("Teilnehmer gelöscht!");
  } catch (error) {
    console.error("Fehler beim Löschen des Teilnehmers:", error);
    res.status(500).send("Fehler beim Löschen des Teilnehmers :(");
  }
});

// hier mit kann man ein teilnehemr in ein gebuchte kurs hinfügen
teilnehmerCRUD_model.put("/:tn_id/:b_id", async (req, res) => {
  const { tn_id, b_id } = req.params;
  try {
    sql = "UPDATE buchungen SET teilnehmer_fkey = $1 WHERE buchung_id = $2";
    werte = [tn_id, b_id];
    erg = await pool.query(sql, werte);
    res.status(200).send("teilnehmer wurd zum gebuchte kurs hinzugfügt");
  } catch (error) {
    console.error("fehler beim einfügen");
    res.status(500).send("server fehler");
  }
});

// hier mit kann man die teilnemerr die ein bestemmten kurs besuche holen =>
teilnehmerCRUD_model.get("/:k_id", async (req, res) => {
  const { k_id } = req.params;
  try {
    const teilnehmerAbfrage = `SELECT t.teilnehmer_id, t.teilnehmer_vorname, t.teilnehmer_nachname 
      FROM teilnehmer t 
      JOIN buchungen b ON t.teilnehmer_id = b.teilnehmer_fkey 
      JOIN kurse k ON b.kurs_fkey = k.kurs_id 
      WHERE k.kurs_id = $1`;

    const erg = await pool.query(teilnehmerAbfrage, [k_id]);

    res.status(200).json(erg.rows);
  } catch (error) {
    console.error("Fehler beim selecten:", error);
    res.status(500).send("Serverfehler :(");
  }
});

module.exports = teilnehmerCRUD_model;

// SELECT d.Vorname, d.Nachname, d.Email
// FROM Dozenten d
// JOIN Buchungen b ON d.DozentenID = b.DozentenID
// JOIN Kurse k ON b.KursID = k.KursID
// WHERE k.Kursname = 'BWL';

// SELECT t.Vorname, t.Nachname, t.Email
// FROM Teilnehmer t
// JOIN Buchungen b ON t.TeilnehmerID = b.TeilnehmerID
// JOIN Kurse k ON b.KursID = k.KursID
// WHERE k.Kursname = 'BWL';
