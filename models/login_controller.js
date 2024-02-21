const express = require("express");
const pool = require("./VSS_DatabaseConnect");
const bcrypt = require("bcrypt");
const saltRounds = 10;


const getUser =
  "SELECT * FROM user_login WHERE user_name =$1 AND user_password = $2";
const addUser =
  "INSERT INTO user_login (user_name, user_password) VALUES ($1,$2)";
const getPassword =
  "SELECT user_password FROM user_login WHERE user_name=$1 LIMIT 1";

const getUserLogin = async (req, res) => {
  try {
    const { user_name, user_password } = req.body;
    console.log(user_name);
    console.log(user_password);

    pool.query(queries.getUser, async (error, results) => {
      results.rows.forEach((element) => {
        const row = Object.values(element);
        const username = row[0];
        const password = row[1];
        const isValid = bcrypt.compareSync(user_password, password);

        if (username && isValid) {
          console.log("Username und Password sind richtig");
          return res.json({ Message: "Username und Password sind richtig" });
          //   return res.sendFile(path.join(__dirname, '../views/MainComponent.js'));
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
    console.error("error", error);
  }
};

const checkUndAddUsersingup = async (req, res) => {
  try {
    const { user_name, user_password } = req.body;

    pool.query(queries.getUser, (error, results) => {
      if (results.rows.length) {
        return res.send("Username is already exist");
      } else {
        const hashpassword = bcrypt.hash(user_password, saltRounds);

        pool.query(
          queries.addUser,
          [user_name, hashpassword],
          (error, result) => {
            if (error) throw error;
            res.status(200).send("ok");
          }
        );
      }
    });
  } catch (error) {
    console.error("error", error);
  }
};

module.exports = {
  getUserLogin,
  checkUndAddUsersingup,
};
