/**
 * @module kursCRUD_model
 * @description Dieses Modul enthält Funktionen für die Verwaltung von Kursen in der Datenbank.
 */

// Erforderliche Module importieren
const express = require("express");
const pool = require("./VSS_DatabaseConnect");

/**
 * @function insert_kurs
 * @description Fügt einen neuen Kurs zur Datenbank hinzu.
 * @param {Object} req - Express Request-Objekt
 * @param {Object} res - Express Response-Objekt
 */
const insert_kurs = async (req, res) => {
  const { kurs_name, kurs_beschreibung, kurs_start_datum, kurs_end_datum } = req.body;
  try {
    const kursAbfrage = "INSERT INTO kurse (kurs_name , kurs_beschreibung, kurs_start_datum ,kurs_end_datum) VALUES ($1,$2,$3,$4)";
    const kursWerte = [kurs_name, kurs_beschreibung, kurs_start_datum, kurs_end_datum];
    await pool.query(kursAbfrage, kursWerte);

    res.status(200).send("Kurs erfolgreich hinzugefügt!");
  } catch (error) {
    console.error("Fehler beim Anlegen des Kurses:", error);
    res.status(500).send("Interner Serverfehler");
  }
};

/**
 * @function update_kurs
 * @description Aktualisiert einen vorhandenen Kurs in der Datenbank.
 * @param {Object} req - Express Request-Objekt
 * @param {Object} res - Express Response-Objekt
 */
const update_kurs = async (req, res) => {
  const { id } = req.params;
  const { kurs_name, kurs_beschreibung, kurs_start_datum, kurs_end_datum } = req.body;
  try {
    const kursUpdateAbfrage = "UPDATE kurse SET kurs_name = $1 , kurs_beschreibung =$2 , kurs_start_datum =$3 ,kurs_end_datum = $4 WHERE kurs_id = $5";
    const kursUpdateWerte = [kurs_name, kurs_beschreibung, kurs_start_datum, kurs_end_datum, id];
    await pool.query(kursUpdateAbfrage, kursUpdateWerte);

    res.status(200).send("Kurs erfolgreich aktualisiert!");
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Kurses:", error);
    res.status(500).send("Interner Serverfehler");
  }
};

/**
 * @function delete_kurs
 * @description Löscht einen Kurs aus der Datenbank.
 * @param {Object} req - Express Request-Objekt
 * @param {Object} res - Express Response-Objekt
 */
const delete_kurs = async (req, res) => {
  const { id } = req.params;
  try {
    const kursDeleteAbfrage = "DELETE FROM kurse WHERE kurs_id = $1";
    await pool.query(kursDeleteAbfrage, [id]);
    res.status(200).send("Kurs erfolgreich gelöscht!");
  } catch (error) {
    console.error("Fehler beim Löschen des Kurses:", error);
    res.status(500).send("Interner Serverfehler");
  }
};

/**
 * @function getAll_kurs
 * @description Holt alle Kurse aus der Datenbank.
 * @param {Object} req - Express Request-Objekt
 * @param {Object} res - Express Response-Objekt
 */
const getAll_kurs = async (req, res) => {
  try {
    const abfrage = `
    SELECT k.*, d.* FROM kurse k LEFT JOIN dozenten d ON d.dozent_id = fk_dozent_id;`;
    const erg = await pool.query(abfrage);

    res.json({
      kurse: erg.rows,
    });
  } catch (error) {
    console.error("Fehler beim Abrufen der Kurse:", error);
    res.status(500).send("Interner Serverfehler");
  }
};

/**
 * @function get_one_kurs
 * @description Holt die Daten eines bestimmten Kurses aus der Datenbank.
 * @param {Object} req - Express Request-Objekt
 * @param {Object} res - Express Response-Objekt
 */
const get_one_kurs = async (req, res) => {
  const { id } = req.params;
  try {
    const abfrage = "SELECT k.*, d.* FROM kurse k LEFT JOIN dozenten d ON d.dozent_id = fk_dozent_id WHERE kurs_id = $1;";
    const erg = await pool.query(abfrage, [id]);

    res.json({ kurse: erg.rows });
  } catch (error) {
    console.error("Fehler beim Abrufen eines Kurses:", error);
    res.status(500).send("Interner Serverfehler");
  }
};

/**
 * @function inserK_buchung
 * @description Fügt einen Teilnehmer zu einem bestimmten Kurs hinzu.
 * @param {Object} req - Express Request-Objekt
 * @param {Object} res - Express Response-Objekt
 */
const inserK_buchung = async (req, res) => {
  const { id_k, id } = req.params;
  try {
    const sqlAbfrage = "SELECT FROM buchungen WHERE kurs_fkey = $1 AND teilnehmer_fkey = $2";
    const werte1 = [id, id_k];
    const erg = await pool.query(sqlAbfrage, werte1);
    if (erg != 0) {
      res.status(400).send("Teilnehmer ist bereits in diesem Kurs");
    } else {
      const sql = "INSERT INTO buchungen (teilnehmer_fkey,kurs_fkey) VALUES ($1,$2)";
      const werte = [id, id_k];
      await pool.query(sql, werte);
      res.status(200).send("Kurs wurde erfolgreich gebucht");
    }
  } catch (error) {
    console.error("Fehler beim Buchen des Kurses:", error);
    res.status(500).send("Interner Serverfehler");
  }
};

// Module exportieren
module.exports = {
  update_kurs,
  getAll_kurs,
  insert_kurs,
  inserK_buchung,
  delete_kurs,
  get_one_kurs,
};
