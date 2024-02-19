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

    pool.query(getPassword, [user_name], async (error, results) => {
      if (results.rows.length) {
        const DBuserpassword = results.rows[0].user_password;
        const isValid = await bcrypt.compare(user_password, DBuserpassword);
        if (isValid) {
          console.log("Sucssess!");
          res.status(201).send("home"); // weg zum home seite
          return;
        } else {
          console.log("Faild!");
          res.status(404).send("login"); // weg zum login seite
        }
      } else {
        console.log("Faild!");
        res.status(404).send("login"); // weg zum login seiter
      }
    });
  } catch (error) {
    console.error("error", error);
  }
};

const checkUndAddUsersingup = async (req, res) => {
  try {
    const { user_name, user_password } = req.body;

    const hashpassword = await bcrypt.hash(user_password, saltRounds);

    pool.query(addUser, [user_name, hashpassword], (error, result) => {
      if (error) throw error;
      res.status(200).send("ok");
    });

    pool.query(getUser, [user_name, user_password], (error, results) => {
      if (results.rows.length) {
        res.send("Username and Password already exists!").status(401);
        return next();
      }

      const DBusername = results.rows.user_name;
      if (DBusername === user_name) {
        res.send("Username is already exist").send(401);
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
