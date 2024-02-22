/**
 * @module pool
 * @description Diese Module exportiert eine Instanz von Pool aus dem 'pg'-Paket, die für die Verbindung zur PostgreSQL-Datenbank verwendet wird.
 */

// Importiert das 'Pool'-Objekt aus dem 'pg'-Paket
const { Pool } = require("pg");

// Konfiguration für die Verbindung zur PostgreSQL-Datenbank
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "verwaltungssoftware",
  password: "admin",
  port: 5432,
});

// Exportiert die erstellte 'Pool'-Instanz für den Einsatz in anderen Dateien
module.exports = pool;
