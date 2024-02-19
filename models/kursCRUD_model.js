const pool = require("./VSS_DatabaseConnect");


// insert ein kurs
const insert_kurs =  async (req, res) => {
  const { kurs_name, kurs_beschreibung, kurs_start_datum, kurs_end_datum } =
    req.body;
  try {
    kursAbfarge =
      "INSERT INTO kurse (kurs_name , kurs_beschreibung, kurs_start_datum ,kurs_end_datum) VALUES ($1,$2,$3,$4)";
    kursWerte = [
      kurs_name,
      kurs_beschreibung,
      kurs_start_datum,
      kurs_end_datum,
    ];
    await pool.query(kursAbfarge, kursWerte);

    res.status(200).send("kurs insert erfolgreich");
  } catch (error) {
    console.error("fehler beim kurs anlegen");
    res.status(500).send("server fehler");
  }
};

// // das ist nur dafür update
const update_kurs = async (req, res) => {
  const { id } = req.params;
  const { kurs_name, kurs_beschreibung, kurs_start_datum, kurs_end_datum } =
    req.body;
  try {
    kursUpdateAbfrage =
      "UPDATE kurse SET kurs_name = $1 , kurs_beschreibung =$2 , kurs_start_datum =$3 ,kurs_end_datum = $4 WHERE kurs_id = $5";
    kursUpdateWerte = [
      kurs_name,
      kurs_beschreibung,
      kurs_start_datum,
      kurs_end_datum,
      id,
    ];

    await pool.query(kursUpdateAbfrage, kursUpdateWerte);

    res.status(200).send("kurs update erflogreich");
  } catch (error) {
    console.error("fehler beim kurs updaten");
    res.status(500).send("server fehler");
  }
};

// // kurs löschen
const delete_kurs = async (req, res) => {
  const { id } = req.params;
  try {
    kursDeleteAbfrage = "DELETE FROM kurse WHERE kurs_id = $1";
    await pool.query(kursDeleteAbfrage, [id]);
    res.status(200).send("kurs wurde gelöscht");
  } catch (error) {
    console.error("fehler beim kurs löschen");
    res.status(500).send("server fehler");
  }
};

// hol die daten von kurses
const getAll_kurs = async (req, res) => {
  try {

    const abfrage = `
    SELECT k.*, d.* FROM kurse k LEFT JOIN dozenten d ON d.dozent_id = fk_dozent_id;`;
    var erg2 = await pool.query(abfrage);

    res.json({
      kurse: erg2.rows,
      // dozenten: erg2.rows,
    });
  } catch (error) {
    console.error("fehler beim select");
    res.status(500).send("server fehler");
  }
};

// insert kurs zum buchung
const inserK_buchung = async (req, res) => {
  const { id } = req.params;
  try {
   sql = "INSERT INTO buchungen (kurs_fkey) VALUES ($1)";
    await pool.query(sql, [id]);
    res.status(200).send("kurs wurde gebucht");
  } catch (error) {
    console.error("fehler beim buchung");
    res.status(500).send("server fehler");
  }
};

module.exports = {
  update_kurs,
  getAll_kurs,
  insert_kurs,
  inserK_buchung,
  delete_kurs,
};


// const express = require('express');
// const axios = require('axios');
// const cors = require('cors');

// const app = express();
// const PORT = 3000;

// app.use(cors());

// app.get('/teilnehmer', async (req, res) => {
//   try {
//     const response = await axios.get('URL_DEINES_BACKEND_ENDPOINTS');
//     const teilnehmerList = response.data;
//     res.json(teilnehmerList);
//   } catch (error) {
//     console.error('Fehler beim Abrufen der Teilnehmer:', error);
//     res.status(500).send('Serverfehler :(');
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server läuft auf http://localhost:${PORT}`);
// });

// import React, { useState, useEffect } from 'react';
// import axios from 'axios'; // Stelle sicher, dass du axios installiert hast: npm install axios

// function TeilnehmerDropdown() {
//   const [teilnehmerList, setTeilnehmerList] = useState([]);

//   useEffect(() => {
//     async function fetchTeilnehmer() {
//       try {
//         const response = await axios.get('URL_DEINES_BACKEND_ENDPOINTS');
//         setTeilnehmerList(response.data);
//       } catch (error) {
//         console.error('Fehler beim Abrufen der Teilnehmer:', error);
//       }
//     }

//     fetchTeilnehmer();
//   }, []); // Leeres Array als Abhängigkeit, um sicherzustellen, dass dieser Effekt nur einmal ausgeführt wird

//   return (
//     <DropdownOptions teilnehmerList={teilnehmerList} />
//   );
// }

// function DropdownOptions({ teilnehmerList }) {
//   return (
//     <div>
//       <label htmlFor="teilnehmerDropdown">Teilnehmer:</label>
//       <select id="teilnehmerDropdown">
//         {teilnehmerList.map((teilnehmer) => (
//           <option key={teilnehmer.teilnehmer_id} value={teilnehmer.teilnehmer_id}>
//             {teilnehmer.name} {/* Annahme: 'name' ist ein Feld im Teilnehmerdatensatz */}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// }

// export default TeilnehmerDropdown;
