const pool = require("./VSS_DatabaseConnect");

// das ist die get damit  holt mann sein daten von database
const getAll_mitarbeiter = async (req, res) => {
  try {
    const abfrage = `
SELECT m.*, kd.* FROM mitarbeiter m LEFT JOIN kontakt_daten kd ON m.mitarbeiter_id = fk_mitarbeiter_id;`;

    const erg = await pool.query(abfrage);

    res.json(erg.rows);
  } catch (error) {
    console.error("Fehler beim Abrufen der Mitarbeite:", error);
    res.status(500).send("Server fehler :(");
  }
};

// nur insert mitarbeiter
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
    mitarbeiterQuery =
      "INSERT INTO mitarbeiter (mitarbeiter_vorname, mitarbeiter_nachname, mitarbeiter_position) VALUES ($1, $2, $3) RETURNING mitarbeiter_id";
    mitarbeiterValues = [vorname, nachname, position];
    erg = await pool.query(mitarbeiterQuery, mitarbeiterValues);
    mitarbeiterId = erg.rows[0].mitarbeiter_id;

    kontaktAbfrage =
      "INSERT INTO kontakt_daten (fk_mitarbeiter_id, kd_ort, kd_straße, kd_haus_nr, kd_plz, kd_email, kd_phone_nr) VALUES ($1, $2, $3, $4, $5, $6,$7)";
    werte = [mitarbeiterId, ort, strasse, hause_nr, plz, email, phone];
    await pool.query(kontaktAbfrage, werte);

    res.status(201).send("Mitarbeiter hinzugefügt!");
  } catch (error) {
    console.error("Fehler beim Hinzufügen des Mitarbeiters:", error);
    res.status(500).send("Interner Serverfehler");
  }
};

// das ist für update bitttttttttte
const update_mitarbeiter =  async (req, res) => {
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
    mitarbeiterAbfrage =
      "UPDATE mitarbeiter SET mitarbeiter_vorname = $1, mitarbeiter_nachname = $2, mitarbeiter_position = $3 WHERE mitarbeiter_id = $4";
    mitarbeiterWerte = [vorname, nachname, position, mitarbeiterId];
    await pool.query(mitarbeiterAbfrage, mitarbeiterWerte);

    kontaktAbfrage =
      "UPDATE kontakt_daten SET kd_ort = $1, kd_straße = $2, kd_haus_nr = $3, kd_plz = $4, kd_email = $5, kd_phone_nr = $6 WHERE fk_mitarbeiter_id = $7";
    werte = [ort, strasse, hause_nr, plz, email, phone, mitarbeiterId];
    await pool.query(kontaktAbfrage, werte);

    res.status(200).send("Mitarbeiter aktualisiert!");
  } catch (error) {
    console.error("Fehler beim aktualisieren des mitarbeiters:", error);
    res.status(500).send("hallo Server fehler :(");
  }
};

// Löschen duch die id muss aber weiter bearbeitet
const delete_mitarbeiter = async (req, res) => {
  const { id_delete } = req.params;

  try {
    kontaktDeleteAbfrage =
      "DELETE FROM kontakt_daten WHERE fk_mitarbeiter_id = $1";
    await pool.query(kontaktDeleteAbfrage, [id_delete]);

    mitarbeiterDeleteAbfrage =
      "DELETE FROM mitarbeiter WHERE mitarbeiter_id = $1";
    await pool.query(mitarbeiterDeleteAbfrage, [id_delete]);

    res.status(200).send("Mitarbeiter gelöscht!");
  } catch (error) {
    console.error("Fehler beim Löschen des Mitarbeiters:", error);
    res.status(500).send("Server fehler");
  }
};


// hol die einzel mitarbeiter daten
const mitarbeiter_Einzel_info = async (req, res) => {
  const { id } = req.params;
  try {
    selectAbfrage = "SELECT * FROM mitarbeiter WHERE mitarbeiter_id = $1";
    ergVonMitarbeiter = await pool.query(selectAbfrage, [id]);
    selectAbfrageKD =
      "SELECT * FROM kontakt_daten WHERE fk_mitarbeiter_id = $1";
    ergVonKontaktdatne = await pool.query(selectAbfrageKD, [id]);
    res.json({
      mitarbeiter: ergVonMitarbeiter.rows,
      kontaktDaten: ergVonKontaktdatne.rows,
    });
  } catch (error) {
    console.error("Fehler beim selektieren der Mitarbeiterinfo:", error);
    res.status(500).send("hau ab ist doch Server fehler");
  }
};

module.exports = {
  mitarbeiter_Einzel_info,
  delete_mitarbeiter,
  update_mitarbeiter,
  insert_mitarbeiter,
  getAll_mitarbeiter,
};
