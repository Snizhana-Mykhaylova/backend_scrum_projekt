const pool = require("./VSS_DatabaseConnect");

// das ist die get damit  holt mann sein daten von database

const insert_dozent = async (req, res) => {
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
    const dozentAbfrage =
      "INSERT INTO dozenten (dozent_vorname , dozent_nachname , dozent_fachgebiet) VALUES ($1, $2,$3) RETURNING dozent_id";
    const dozentWerte = [vorname, nachname, fachgebiet];
    const erg = await pool.query(dozentAbfrage, dozentWerte);
    const id = erg.rows[0].dozent_id;
    const kontaktAbfrage =
      "INSERT INTO kontakt_daten (fk_dozent_id, kd_ort, kd_straße, kd_haus_nr, kd_plz, kd_email, kd_phone_nr) VALUES ($1, $2, $3, $4, $5, $6,$7)";
    const werte = [id, ort, strasse, hause_nr, plz, email, phone];
    await pool.query(kontaktAbfrage, werte);

    res.status(200).send("dozent hinzugefügt");
  } catch (error) {
    console.error("fehler beim dozent hinzufügen");
    res.status(500).send("fehler    :(");
  }
};

// get dozent info durch get
const getAll_dozent_info = async (req, res) => {
  try {
    const abfrage = `
    SELECT d.*, kd.*
    FROM dozenten d
    LEFT JOIN kontakt_daten kd ON d.dozent_id = kd.fk_dozent_id;`;
    const erg = await pool.query(abfrage);

    res.json(erg.rows);
  } catch (error) {
    console.error("Fehler beim Abrufen der dozent:", error);
    res.status(500).send("Server fehler :(");
  }
};

// hier mit kann man löschen dozen und sein kontakt ddaten updaten  =>  http://localhost:5500/delete_dozent/5

const delete_dozent = async (req, res) => {
  const { id } = req.params;
  try {

      kontaktDeleteAbfrage = "DELETE FROM kontakt_daten WHERE fk_dozent_id = $1";
      await pool.query(kontaktDeleteAbfrage, [id]);

      dozentDeleteAbfrage = "DELETE FROM dozenten WHERE dozent_id =$1";
      await pool.query(dozentDeleteAbfrage, [id]);

    res.status(200).send("wurde gelöscht");
  } catch (error) {
    console.error("fehler beim dozent löschen".error);
    res.status(500).send("server fehler");
  }
};

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
    dozentAbfrage =
      "UPDATE dozenten SET dozent_vorname = $1, dozent_nachname = $2 , dozent_fachgebiet = $3 WHERE dozent_id = $4";
    dozentWerte = [vorname, nachname, fachgebiet, id];
    erg = await pool.query(dozentAbfrage, dozentWerte);

    kontaktAbfrage =
      "UPDATE kontakt_daten SET kd_ort = $1, kd_straße = $2, kd_haus_nr = $3, kd_plz = $4, kd_email = $5, kd_phone_nr = $6 WHERE fk_dozent_id = $7";
    werte = [ort, strasse, hause_nr, plz, email, phone, id];
    erg2 = await pool.query(kontaktAbfrage, werte);

    res.status(200).send("dozent konatkt daten aktualisiert");
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Dozenten:");
    res.status(500).send("Fehler beim Aktualisieren des Dozenten.");
  }
};

// hier mit kann man die einbestimmt dozent in ein bestimmt kurs hinfügen
const delete_dozent_kurs = async (req, res) => {
  const { id, kurs_id } = req.params;
  try {
    const updateQuery = "UPDATE kurse SET fk_dozent_id = $1 WHERE kurs_id = $2";
    await pool.query(updateQuery, [id, kurs_id]);
    res.status(201).send("Dozent hinzugefügt! :)");
  } catch (error) {
    console.error("Fehler beim Hinzufügen des Dozenten:", error);
    res.status(500).send("Server Fehler :(");
  }
};

// const get_one_dozent =  async (req, res) => {
//   const { id } = req.params;
//   try {
//     const abfrage =
//       "SELECT * FROM dozenten d INNER JOIN kontakt_daten kd ON d.dozent_id = kd.fk_dozent_id WHERE dozent_id =$1;";

//     const erg = await pool.query(abfrage, [id]);
//     res.json(erg.rows);
//     res.status(200);
//   } catch (error) {
//     console.error("Fehler beim Abrufen der Dozenten:", error);
//     res.status(500).send("Server fehler beim Abrufen der Dozenten.");
//   }
// };

const get_one_dozent = async (req, res) => {
  const { id } = req.params;
  try {
    selectAbfrage = "SELECT * FROM dozenten WHERE dozent_id = $1";
    ergVonDozenten = await pool.query(selectAbfrage, [id]);
    selectAbfrageKD = "SELECT * FROM kontakt_daten WHERE fk_dozent_id = $1";
    ergVonKontaktdatne = await pool.query(selectAbfrageKD, [id]);
    res.json({
      dozenten: ergVonDozenten.rows,
      kontaktDaten: ergVonKontaktdatne.rows,
    });
  } catch (error) {
    console.error("Fehler beim select der dozenten", error);
    res.status(500).send("hau ab ist doch Server fehler");
  }
};

module.exports = {
  insert_dozent,
  getAll_dozent_info,
  update_dozent,
  delete_dozent,
  delete_dozent_kurs,
  get_one_dozent,
};