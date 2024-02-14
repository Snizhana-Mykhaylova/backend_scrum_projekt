
const getUser = "SELECT * FROM user_login WHERE user_name =$1 AND user_password = $2";
const addUser = "INSERT INTO user_login (user_name, user_password) VALUES ($1,$2)";
const getPassword = "SELECT user_password FROM user_login WHERE user_name=$1 LIMIT 1";
const getTeilnehmer = "SELECT kd_ort,kd_straße,kd_haus_nr,kd_plz,kd_email,kd_phone_nr FROM kontakt_daten INNER JOIN teilnehmer ON teilnehmer.teilnehmer_id = kontakt_daten.kd_id";
// const getTeilnehmer = "SELECT * FROM teilnehmer INNER JOIN kontakt_daten ON kontakt_daten.kd_id = teilnehmer.teilnehmer_id";
const getDozenten = "SELECT * FROM dozenten INNER JOIN kontakt_daten ON kontakt_daten.kd_id = dozenten.dozent_id";
const getKurse = "SELECT * FROM kurese INNER JOIN dozenten ON dozenten.dozent_id = kurse.kurs_id";


module.exports = {
    getUser,
    addUser,
    getPassword,
    getTeilnehmer,
    getDozenten,
    getKurse
};