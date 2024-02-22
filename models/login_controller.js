/**
 * @module login_controller
 * @description Dieses Modul enthält Funktionen für die Authentifizierung und Benutzerregistrierung.
 */

// Erforderliche Module importieren
const express = require("express");
const pool = require("./VSS_DatabaseConnect");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// SQL-Abfragen definieren
const getUser = "SELECT * FROM user_login WHERE user_name =$1 AND user_password = $2";
const addUser = "INSERT INTO user_login (user_name, user_password) VALUES ($1,$2)";
const getPassword = "SELECT user_password FROM user_login WHERE user_name=$1 LIMIT 1";

/**
 * @function getUserLogin
 * @description Überprüft die Benutzeranmeldeinformationen und gibt eine entsprechende Nachricht zurück.
 * @param {Object} req - Express Request-Objekt
 * @param {Object} res - Express Response-Objekt
 */
const getUserLogin = async (req, res) => {
  try {
    const { user_name, user_password } = req.body;

    pool.query(getUser, async (error, results) => {
      results.rows.forEach((element) => {
        const row = Object.values(element);
        const username = row[0];
        const password = row[1];
        const isValid = bcrypt.compareSync(user_password, password);

        if (username && isValid) {
          console.log("Username und Password sind korrekt");
          return res.json({ Message: "Username und Password sind korrekt" });
        }

        if (!username && isValid) {
          console.log("Username ist nicht korrekt");
          return res.json({ Message: "Username ist nicht korrekt" });
        }

        if (username && !isValid) {
          console.log("Passwort ist nicht korrekt");
          return res.json({ Message: "Passwort ist nicht korrekt" });
        }
      });
    });
  } catch (error) {
    console.error("Fehler", error);
  }
};

/**
 * @function checkUndAddUsersingup
 * @description Überprüft die Benutzerregistrierung und fügt einen neuen Benutzer hinzu, wenn der Benutzername noch nicht existiert.
 * @param {Object} req - Express Request-Objekt
 * @param {Object} res - Express Response-Objekt
 */
const checkUndAddUsersingup = async (req, res) => {
  try {
    const { user_name, user_password } = req.body;

    pool.query(getUser, (error, results) => {
      if (results.rows.length) {
        return res.send("Benutzername existiert bereits");
      } else {
        const hashpassword = bcrypt.hashSync(user_password, saltRounds);

        pool.query(
          addUser,
          [user_name, hashpassword],
          (error, result) => {
            if (error) throw error;
            res.status(200).send("Erfolgreich registriert");
          }
        );
      }
    });
  } catch (error) {
    console.error("Fehler", error);
  }
};

// Module exportieren
module.exports = {
  getUserLogin,
  checkUndAddUsersingup,
};
