/**
 * @module dozentCRUD_model
 * @description Dieses Modul enthält Funktionen für die Verwaltung von Dozenten in der Datenbank.
 */

// Erforderliche Module importieren
const pool = require("./VSS_DatabaseConnect");

/**
 * @function insert_dozent
 * @description Fügt einen neuen Dozenten zur Datenbank hinzu.
 * @param {Object} req - Express Request-Objekt
 * @param {Object} res - Express Response-Objekt
 */
const insert_dozent = async (req, res) => {
  // Extrahieren der Dozenteninformationen aus dem Anfrageobjekt
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
    // Überprüfen, ob der Dozent bereits existiert
    const checkAbfrage =
      "SELECT * FROM dozenten WHERE dozent_vorname = $1 AND dozent_nachname = $2";
    const checkErg = await pool.query(checkAbfrage, [vorname, nachname]);

    // Wenn der Dozent nicht existiert, füge ihn hinzu
    if (checkErg.rows.length === 0) {
      // Abfrage zum Einfügen des Dozenten in die Datenbank
      const dozentAbfrage =
        "INSERT INTO dozenten (dozent_vorname , dozent_nachname , dozent_fachgebiet) VALUES ($1, $2,$3) RETURNING dozent_id";
      const dozentWerte = [vorname, nachname, fachgebiet];
      const erg = await pool.query(dozentAbfrage, dozentWerte);
      const id = erg.rows[0].dozent_id;

      // Abfrage zum Einfügen der Kontaktinformationen des Dozenten in die Datenbank
      const kontaktAbfrage =
        "INSERT INTO kontakt_daten (fk_dozent_id, kd_ort, kd_straße, kd_haus_nr, kd_plz, kd_email, kd_phone_nr) VALUES ($1, $2, $3, $4, $5, $6,$7)";
      const werte = [id, ort, strasse, hause_nr, plz, email, phone];
      await pool.query(kontaktAbfrage, werte);

      res.status(200).send("Dozent erfolgreich hinzugefügt!");
    } else {
      console.log("Dozent existiert bereits in der Datenbank");
      res.status(409).send("Dozent existiert bereits");
    }
  } catch (error) {
    console.error("Fehler beim Hinzufügen des Dozenten:", error);
    res.status(500).send("Interner Serverfehler");
  }
};


/**
 * @function getAll_dozent_info
 * @description Holt alle Dozenteninformationen aus der Datenbank.
 * @param {Object} req - Express Request-Objekt
 * @param {Object} res - Express Response-Objekt
 */
const getAll_dozent_info = async (req, res) => {
  try {
    // Abfrage zum Abrufen aller Dozenteninformationen aus der Datenbank
    const abfrage = `
    SELECT d.*, kd.*
    FROM dozenten d
    LEFT JOIN kontakt_daten kd ON d.dozent_id = kd.fk_dozent_id;`;
    const erg = await pool.query(abfrage);

    res.json(erg.rows);
  } catch (error) {
    console.error("Fehler beim Abrufen der Dozenten:", error);
    res.status(500).send("Interner Serverfehler");
  }
};

/**
 * @function delete_dozent
 * @description Löscht einen Dozenten und die zugehörigen Kontaktinformationen aus der Datenbank.
 * @param {Object} req - Express Request-Objekt
 * @param {Object} res - Express Response-Objekt
 */
const delete_dozent = async (req, res) => {
  const { id } = req.params;
  try {
    // Abfrage zum Löschen des Dozenten aus der Datenbank
    kontaktDeleteAbfrage = "DELETE FROM kontakt_daten WHERE fk_dozent_id = $1";
    await pool.query(kontaktDeleteAbfrage, [id]);

    dozentDeleteAbfrage = "DELETE FROM dozenten WHERE dozent_id =$1";
    await pool.query(dozentDeleteAbfrage, [id]);

    res.status(200).send("wurde gelöscht");
  } catch (error) {
    console.error("Fehler beim Löschen des Dozenten:", error);
    res.status(500).send("Interner Serverfehler");
  }
};

/**
 * @function update_dozent
 * @description Aktualisiert die Informationen eines Dozenten und die zugehörigen Kontaktinformationen in der Datenbank.
 * @param {Object} req - Express Request-Objekt
 * @param {Object} res - Express Response-Objekt
 */
const update_dozent = async (req, res) => {
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
    // Abfrage zum Aktualisieren der Dozenteninformationen in der Datenbank
    const dozentAbfrage =
      "UPDATE dozenten SET dozent_vorname = $1, dozent_nachname = $2 , dozent_fachgebiet = $3 WHERE dozent_id = $4";
    const dozentWerte = [vorname, nachname, fachgebiet, id];
    await pool.query(dozentAbfrage, dozentWerte);

    // Abfrage zum Aktualisieren der Kontaktinformationen des Dozenten in der Datenbank
    const kontaktAbfrage =
      "UPDATE kontakt_daten SET kd_ort = $1, kd_straße = $2, kd_haus_nr = $3, kd_plz = $4, kd_email = $5, kd_phone_nr = $6 WHERE fk_dozent_id = $7";
    const werte = [ort, strasse, hause_nr, plz, email, phone, id];
    await pool.query(kontaktAbfrage, werte);

    res.status(200).send("Dozenteninformationen erfolgreich aktualisiert!");
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Dozenten:", error);
    res.status(500).send("Interner Serverfehler");
  }
};

/**
 * @function delete_dozent_kurs
 * @description Löscht einen Dozenten aus einem bestimmten Kurs.
 * @param {Object} req - Express Request-Objekt
 * @param {Object} res - Express Response-Objekt
 */
const delete_dozent_kurs = async (req, res) => {
  const {  kurs_id } = req.params;
  try {
    // Abfrage zum Entfernen eines Dozenten aus einem bestimmten Kurs
    const updateQuery = "UPDATE kurse SET fk_dozent_id = $1  WHERE kurs_id = $2";
    werte = [null , kurs_id]
    await pool.query(updateQuery, werte);
    res.status(201).send("Dozent erfolgreich entfernt!");
  } catch (error) {
    console.error("Fehler beim Entfernen des Dozenten aus dem Kurs:", error);
    res.status(500).send("Interner Serverfehler");
  }
};

/**
 * @function get_one_dozent
 * @description Holt die Informationen eines bestimmten Dozenten aus der Datenbank.
 * @param {Object} req - Express Request-Objekt
 * @param {Object} res - Express Response-Objekt
 */
const get_one_dozent = async (req, res) => {
  const { id } = req.params;
  try {
    // Abfrage zum Abrufen der Informationen eines bestimmten Dozenten aus der Datenbank
    const selectAbfrage = "SELECT * FROM dozenten WHERE dozent_id = $1";
    const ergVonDozenten = await pool.query(selectAbfrage, [id]);
    const selectAbfrageKD =
      "SELECT * FROM kontakt_daten WHERE fk_dozent_id = $1";
    const ergVonKontaktdatne = await pool.query(selectAbfrageKD, [id]);
    res.json({
      dozenten: ergVonDozenten.rows,
      kontaktDaten: ergVonKontaktdatne.rows,
    });
  } catch (error) {
    console.error("Fehler beim Abrufen der Dozenten:", error);
    res.status(500).send("Interner Serverfehler");
  }
};


const insert_dozent_into_kurs = async(req,res) => {
  const {id , kurs_id} = req.params;
  try {
  sqlAbfarge = "UPDATE kurse SET fk_dozent_id =$1 WHERE kurs_id = $2";
  werte = [id , kurs_id];
  const erg = await pool.query(sqlAbfarge ,werte);
  res.status(200).send("dozen wurde eingefügt")
  } catch (error) {
    console.error("fehler beim einfügen");
    res.status(500).send("server fehler")
  }
}

// Module exportieren
module.exports = {
  insert_dozent,
  getAll_dozent_info,
  update_dozent,
  delete_dozent,
  delete_dozent_kurs,
  get_one_dozent,
  insert_dozent_into_kurs,
};
