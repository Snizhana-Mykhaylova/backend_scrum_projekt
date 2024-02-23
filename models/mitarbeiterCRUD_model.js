/**
 * @module mitarbeiterCRUD_model
 * @description Dieses Modul enthält CRUD-Operationen für Mitarbeiter und deren Kontaktinformationen.
 */

// Datenbank-Pool importieren
const pool = require("./VSS_DatabaseConnect");

/**
 * @function getAll_mitarbeiter
 * @description Holt alle Mitarbeiterdaten aus der Datenbank und deren zugehörige Kontaktinformationen.
 * @param {Object} req - Express Request-Objekt
 * @param {Object} res - Express Response-Objekt
 */
const getAll_mitarbeiter = async (req, res) => {
  try {
    // SQL-Abfrage für den Abruf von Mitarbeitern und deren Kontaktinformationen
    const abfrage = `
      SELECT m.*, kd.* FROM mitarbeiter m LEFT JOIN kontakt_daten kd ON m.mitarbeiter_id = fk_mitarbeiter_id;`;

    const erg = await pool.query(abfrage);

    res.json(erg.rows);
  } catch (error) {
    console.error("Fehler beim Abrufen der Mitarbeiter:", error);
    res.status(500).send("Serverfehler :(");
  }
};

/**
 * @function insert_mitarbeiter
 * @description Fügt einen neuen Mitarbeiter und dessen Kontaktinformationen in die Datenbank ein.
 * @param {Object} req - Express Request-Objekt
 * @param {Object} res - Express Response-Objekt
 */
const insert_mitarbeiter = async (req, res) => {
  const {
    vorname,
    nachname,
    position,
    phone,
    plz,
    ort,
    strasse,
    email,
    hause_nr,
  } = req.body;

  try {
    // Überprüfen, ob der Mitarbeiter bereits existiert
    const checkAbfrage =
      "SELECT * FROM mitarbeiter WHERE mitarbeiter_vorname = $1 AND mitarbeiter_nachname = $2";
    const checkErg = await pool.query(checkAbfrage, [vorname, nachname]);

    // Wenn der Mitarbeiter nicht existiert, füge ihn hinzu
    if (checkErg.rows.length === 0) {
      // SQL-Abfrage zum Einfügen eines neuen Mitarbeiters
      const mitarbeiterQuery =
        "INSERT INTO mitarbeiter (mitarbeiter_vorname, mitarbeiter_nachname, mitarbeiter_position) VALUES ($1, $2, $3) RETURNING mitarbeiter_id";
      const mitarbeiterValues = [vorname, nachname, position];
      const erg = await pool.query(mitarbeiterQuery, mitarbeiterValues);
      const mitarbeiterId = erg.rows[0].mitarbeiter_id;

      // SQL-Abfrage zum Einfügen der Kontaktinformationen des neuen Mitarbeiters
      const kontaktAbfrage =
        "INSERT INTO kontakt_daten (fk_mitarbeiter_id, kd_ort, kd_straße, kd_haus_nr, kd_plz, kd_email, kd_phone_nr) VALUES ($1, $2, $3, $4, $5, $6, $7)";
      const werte = [mitarbeiterId, ort, strasse, hause_nr, plz, email, phone];
      await pool.query(kontaktAbfrage, werte);

      res.status(201).send("Mitarbeiter hinzugefügt!");
    } else {
      console.log("Mitarbeiter existiert bereits in der Datenbank");
      res.status(409).send("Mitarbeiter existiert bereits");
    }
  } catch (error) {
    console.error("Fehler beim Hinzufügen des Mitarbeiters:", error);
    res.status(500).send("Interner Serverfehler");
  }
};


/**
 * @function update_mitarbeiter
 * @description Aktualisiert die Informationen eines Mitarbeiters und dessen Kontaktinformationen anhand der Mitarbeiter-ID.
 * @param {Object} req - Express Request-Objekt
 * @param {Object} res - Express Response-Objekt
 */
const update_mitarbeiter = async (req, res) => {
  const { mitarbeiterId } = req.params;
  const {
    vorname,
    nachname,
    position,
    phone,
    plz,
    ort,
    strasse,
    email,
    hause_nr,
  } = req.body;

  try {
    // SQL-Abfrage zur Aktualisierung der Mitarbeiterdaten
    const mitarbeiterAbfrage =
      "UPDATE mitarbeiter SET mitarbeiter_vorname = $1, mitarbeiter_nachname = $2, mitarbeiter_position = $3 WHERE mitarbeiter_id = $4";
    const mitarbeiterWerte = [vorname, nachname, position, mitarbeiterId];
    await pool.query(mitarbeiterAbfrage, mitarbeiterWerte);

    // SQL-Abfrage zur Aktualisierung der Kontaktinformationen des Mitarbeiters
    const kontaktAbfrage =
      "UPDATE kontakt_daten SET kd_ort = $1, kd_straße = $2, kd_haus_nr = $3, kd_plz = $4, kd_email = $5, kd_phone_nr = $6 WHERE fk_mitarbeiter_id = $7";
    const werte = [ort, strasse, hause_nr, plz, email, phone, mitarbeiterId];
    await pool.query(kontaktAbfrage, werte);

    res.status(200).send("Mitarbeiter aktualisiert!");
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Mitarbeiters:", error);
    res.status(500).send("Interner Serverfehler");
  }
};

/**
 * @function delete_mitarbeiter
 * @description Löscht einen Mitarbeiter und dessen Kontaktinformationen anhand der Mitarbeiter-ID.
 * @param {Object} req - Express Request-Objekt
 * @param {Object} res - Express Response-Objekt
 */
const delete_mitarbeiter = async (req, res) => {
  const { id_delete } = req.params;

  try {
    // SQL-Abfrage zum Löschen der Kontaktinformationen des Mitarbeiters
    const kontaktDeleteAbfrage =
      "DELETE FROM kontakt_daten WHERE fk_mitarbeiter_id = $1";
    await pool.query(kontaktDeleteAbfrage, [id_delete]);

    // SQL-Abfrage zum Löschen des Mitarbeiters
    const mitarbeiterDeleteAbfrage =
      "DELETE FROM mitarbeiter WHERE mitarbeiter_id = $1";
    await pool.query(mitarbeiterDeleteAbfrage, [id_delete]);

    res.status(200).send("Mitarbeiter gelöscht!");
  } catch (error) {
    console.error("Fehler beim Löschen des Mitarbeiters:", error);
    res.status(500).send("Serverfehler");
  }
};

/**
 * @function mitarbeiter_Einzel_info
 * @description Holt die Informationen eines einzelnen Mitarbeiters und dessen Kontaktinformationen anhand der Mitarbeiter-ID.
 * @param {Object} req - Express Request-Objekt
 * @param {Object} res - Express Response-Objekt
 */
const mitarbeiter_Einzel_info = async (req, res) => {
  const { id } = req.params;
  try {
    // SQL-Abfragen zum Abrufen der Mitarbeiterinformationen und der zugehörigen Kontaktinformationen
    const selectAbfrage = "SELECT * FROM mitarbeiter WHERE mitarbeiter_id = $1";
    const ergVonMitarbeiter = await pool.query(selectAbfrage, [id]);
    const selectAbfrageKD =
      "SELECT * FROM kontakt_daten WHERE fk_mitarbeiter_id = $1";
    const ergVonKontaktdaten = await pool.query(selectAbfrageKD, [id]);
    res.json({
      mitarbeiter: ergVonMitarbeiter.rows,
      kontaktDaten: ergVonKontaktdaten.rows,
    });
  } catch (error) {
    console.error("Fehler beim Selektieren der Mitarbeiterinfo:", error);
    res.status(500).send("Serverfehler");
  }
};

// Module exportieren
module.exports = {
  mitarbeiter_Einzel_info,
  delete_mitarbeiter,
  update_mitarbeiter,
  insert_mitarbeiter,
  getAll_mitarbeiter,
};
