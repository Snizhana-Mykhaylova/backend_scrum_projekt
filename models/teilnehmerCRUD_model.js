const pool = require("./VSS_DatabaseConnect");

/**
 * @function getAll_teilnehmer
 * @description Diese Funktion wird aufgerufen, um alle Teilnehmerinformationen aus der Datenbank abzurufen.
 * @param {object} req - Das Anfrageobjekt von Express.
 * @param {object} res - Das Antwortobjekt von Express.
 * @returns {json} - Gibt ein JSON-Objekt mit den abgerufenen Teilnehmerdaten zurück.
 * @throws {error} - Wirft einen Fehler, wenn das Abrufen der Teilnehmerdaten fehlschlägt.
 */
const getAll_teilnehmer = async (req, res) => {
  try {
    // SQL-Abfrage, die Teilnehmerdaten und zugehörige Kontaktdaten aus der Datenbank abruft
    const Abfrage = `
      SELECT t.*, kd.* FROM teilnehmer t LEFT JOIN kontakt_daten kd ON t.teilnehmer_id = kd.fk_teilnehmer_id;`;
    
    // Ausführung der SQL-Abfrage über die mit pool.query verbundene Datenbankverbindung
    const result = await pool.query(Abfrage);

    // Sendet die abgerufenen Teilnehmerdaten als JSON-Antwort
    res.json(result.rows);
  } catch (error) {
    // Konsolenausgabe bei einem Fehler und Senden einer Fehlermeldung an den Client
    console.error("Fehler beim Abrufen der Teilnehmer:", error);
    res.status(500).send("Serverfehler :(");
  }
};


// Teilnehmer Einzelinfo durch ID aufrufen
const get_tnEinzel = async (req, res) => {
  const { E_id } = req.params;
  
  try {
    // SQL-Abfrage, um Teilnehmerdaten basierend auf der Teilnehmer-ID abzurufen
    const selectAbfrage = "SELECT * FROM teilnehmer WHERE teilnehmer_id = $1";
    const ergVonTeilnehmer = await pool.query(selectAbfrage, [E_id]);
    const selectAbfrageKD =
      "SELECT * FROM kontakt_daten WHERE fk_teilnehmer_id = $1";
    const ergVonKontaktdaten = await pool.query(selectAbfrageKD, [E_id]);
    
    // Sendet die abgerufenen Teilnehmer- und Kontaktdaten als JSON-Antwort
    res.json({
      teilnehmer: ergVonTeilnehmer.rows,
      kontaktDaten: ergVonKontaktdaten.rows,
    });
  } catch (error) {
    // Konsolenausgabe bei einem Fehler und Senden einer Fehlermeldung an den Client
    console.error("Fehler beim Selektieren der Teilnehmerinfo:", error);
    res.status(500).send("Serverfehler");
  }
};

/**
 * @function insert_teilnehmer
 * @description Diese Funktion wird aufgerufen, um einen neuen Teilnehmer zusammen mit seinen Kontaktdaten in die Datenbank einzufügen.
 * @param {object} req - Das Anfrageobjekt von Express mit den Benutzerdaten im Anfragekörper.
 * @param {object} res - Das Antwortobjekt von Express.
 * @returns {status} - Gibt einen HTTP-Statuscode zurück, um den Erfolg oder Fehler des Hinzufügens zu signalisieren.
 * @throws {error} - Wirft einen Fehler, wenn das Hinzufügen des Teilnehmers fehlschlägt.
 */
const insert_teilnehmer = async (req, res) => {

  const { vorname, nachname, phone, plz, ort, strasse, email, hause_nr } =
    req.body;
  try {
    await pool.query("BEGIN");

    const teilnehmerAbfrage =
      "INSERT INTO teilnehmer (teilnehmer_vorname, teilnehmer_nachname) VALUES ($1, $2) RETURNING teilnehmer_id";
    const teilnehmerWerte = [vorname, nachname];
    const teilnehmerErg = await pool.query(teilnehmerAbfrage, teilnehmerWerte);
    const teilnehmerId = teilnehmerErg.rows[0].teilnehmer_id;


    const TN_KD_Abfrage =
      "INSERT INTO kontakt_daten (fk_teilnehmer_id, kd_ort, kd_straße, kd_haus_nr, kd_plz, kd_email, kd_phone_nr) VALUES ($1, $2, $3, $4, $5, $6, $7)";
    const TN_KD_Werte = [
      teilnehmerId,
      ort,
      strasse,
      hause_nr,
      plz,
      email,
      phone,
    ];
    await pool.query(TN_KD_Abfrage, TN_KD_Werte);

    await pool.query("COMMIT");

    res.status(201).send("Teilnehmer hinzugefügt!");
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Fehler beim Hinzufügen des Teilnehmers:", error);
    res.status(500).send("Interner Serverfehler");
  }
};

/**
 * @function update_TN
 * @description Diese Funktion wird aufgerufen, um die Informationen eines Teilnehmers und seiner Kontaktdaten in der Datenbank zu aktualisieren.
 * @param {object} req - Das Anfrageobjekt von Express mit den Teilnehmerdaten im Anfragekörper und der Teilnehmer-ID in den Parametern.
 * @param {object} res - Das Antwortobjekt von Express.
 * @returns {status} - Gibt einen HTTP-Statuscode zurück, um den Erfolg oder Fehler der Aktualisierung zu signalisieren.
 * @throws {error} - Wirft einen Fehler, wenn die Aktualisierung des Teilnehmers fehlschlägt.
 */
const update_TN = async (req, res) => {
  // Extrahiert die Teilnehmer-ID aus den Parametern der Anfrage
  const { TN_id } = req.params;

  const { vorname, nachname, phone, plz, ort, strasse, email, hause_nr } =
    req.body;
  try {
    const teilnehmerAbfrage =
      "UPDATE teilnehmer SET teilnehmer_vorname = $1, teilnehmer_nachname = $2 WHERE teilnehmer_id = $3";
    const teilnehmerWerte = [vorname, nachname, TN_id];
    await pool.query(teilnehmerAbfrage, teilnehmerWerte);

    const kontaktAbfrage =
      "UPDATE kontakt_daten SET kd_ort = $1, kd_straße = $2, kd_haus_nr = $3, kd_plz = $4, kd_email = $5, kd_phone_nr = $6 WHERE fk_teilnehmer_id = $7";
    const KD_Werte = [ort, strasse, hause_nr, plz, email, phone, TN_id];
    await pool.query(kontaktAbfrage, KD_Werte);

    // Sendet eine Erfolgsmeldung mit dem HTTP-Statuscode 200 (OK)
    res.status(200).send("Teilnehmer aktualisiert!");
  } catch (error) {
    // Konsolenausgabe bei einem Fehler und Senden einer Fehlermeldung an den Client
    console.error("Fehler beim Aktualisieren des Teilnehmers:", error);
    res.status(500).send("Interner Serverfehler");
  }
};

/**
 * @function teilnehemr_delete
 * @description Diese Funktion wird aufgerufen, um einen Teilnehmer und seine zugehörigen Kontaktdaten aus der Datenbank zu löschen.
 * @param {object} req - Das Anfrageobjekt von Express mit der Teilnehmer-ID in den Parametern.
 * @param {object} res - Das Antwortobjekt von Express.
 * @returns {status} - Gibt einen HTTP-Statuscode zurück, um den Erfolg oder Fehler des Löschvorgangs zu signalisieren.
 * @throws {error} - Wirft einen Fehler, wenn das Löschen des Teilnehmers fehlschlägt.
 */
const teilnehemr_delete = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("BEGIN");

    const kontaktLöschenAbfrage =
      "DELETE FROM kontakt_daten WHERE fk_teilnehmer_id = $1";
    await pool.query(kontaktLöschenAbfrage, [id]);

    const teilnehmerDeleteAbfrage =
      "DELETE FROM teilnehmer WHERE teilnehmer_id = $1";
    await pool.query(teilnehmerDeleteAbfrage, [id]);

    await pool.query("COMMIT");

    // Sendet eine Erfolgsmeldung mit dem HTTP-Statuscode 200 (OK)
    res.status(200).send("Teilnehmer gelöscht!");
  } catch (error) {

    await pool.query("ROLLBACK");
    console.error("Fehler beim Löschen des Teilnehmers:", error);
    res.status(500).send("Fehler beim Löschen des Teilnehmers");
  }
};

/**
 * @function tn_buchung_insert
 * @description Diese Funktion wird aufgerufen, um Teilnehmer zu einem bestimmten Kurs in der Datenbank hinzuzufügen.
 * @param {object} req - Das Anfrageobjekt von Express mit den Teilnehmer-IDs und Kurs-ID im Anfragekörper.
 * @param {object} res - Das Antwortobjekt von Express.
 * @returns {status} - Gibt einen HTTP-Statuscode zurück, um den Erfolg oder Fehler des Hinzufügens zu signalisieren.
 * @throws {error} - Wirft einen Fehler, wenn das Hinzufügen der Teilnehmer zum Kurs fehlschlägt.
 */
const tn_buchung_insert = async (req, res) => {

  const { teilnehmer_ids, k_id } = req.body;
  const client = await pool.connect();

  try {
    // Überprüft, ob teilnehmer_ids ein gültiges Array mit mindestens einem Element ist
    if (!Array.isArray(teilnehmer_ids) || teilnehmer_ids.length === 0) {
      return res.status(400).send("Teilnehmer-ID(s) ungültig");
    }


    await abfrage.query("BEGIN");

    // Durchläuft das Array der Teilnehmer-IDs und fügt jeden Teilnehmer zum Kurs hinzu
    for (const tn_id of teilnehmer_ids) {
      const sql =
        "INSERT INTO buchungen (teilnehmer_fkey, kurs_fkey) VALUES ($1, $2)";
      const werte = [tn_id, k_id];
      await client.query(sql, werte);
    }

    await abfrage.query("COMMIT");
    res.status(200).send("teilnehmer zum gebuchten Kurs hinzugefügt");
  } catch (error) {
    // Rollback der Transaktion bei einem Fehler und Senden einer Fehlermeldung an den Client
    await client.query("ROLLBACK");
    console.error("Fehler beim Hinzufügen der Teilnehmer zum Kurs:", error);
    res.status(500).send("Serverfehler");
  } finally {
    // Gibt den Datenbank-Client wieder frei
    client.release();
  }
};


// Teilnehmer, die einen bestimmten Kurs besuchen, abrufen
const get_enzelTN_buchung = async (req, res) => {
  // Extrahiert die Kurs-ID aus den Parametern der Anfrage
  const { k_id } = req.params;

  try {
    // SQL-Abfrage, um Teilnehmer für einen bestimmten Kurs abzurufen
    const teilnehmerAbfrage = `
      SELECT t.teilnehmer_id, t.teilnehmer_vorname, t.teilnehmer_nachname 
      FROM teilnehmer t 
      JOIN buchungen b ON t.teilnehmer_id = b.teilnehmer_fkey 
      JOIN kurse k ON b.kurs_fkey = k.kurs_id 
      WHERE k.kurs_id = $1`;
    
    // Führt die SQL-Abfrage aus und gibt die Ergebnisse als JSON zurück
    const erg = await pool.query(teilnehmerAbfrage, [k_id]);
    res.status(200).json(erg.rows);
  } catch (error) {
    // Konsolenausgabe bei einem Fehler und Senden einer Fehlermeldung an den Client
    console.error("Fehler beim Selektieren:", error);
    res.status(500).send("Serverfehler");
  }
};

// Exportiert die Funktionen für den Einsatz in anderen Dateien
module.exports = {
  get_enzelTN_buchung,
  tn_buchung_insert,
  get_tnEinzel,
  getAll_teilnehmer,
  insert_teilnehmer,
  update_TN,
  teilnehemr_delete,
};

