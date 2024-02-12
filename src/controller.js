const { log, error } = require('console');
const pool = require('../db');
const queries = require('./queries');
const bcrypt = require('bcrypt');
const saltRounds = 10;


const getUserLogin = async (req, res) => {
    try{
        const { user_name , user_password } = req.body;

        pool.query(queries.getPassword, [user_name] ,async (error,results) => {
            if(results.rows.length){
                const DBuserpassword = results.rows[0].user_password;
                const isValid = await bcrypt.compare(user_password, DBuserpassword);    
                if(isValid){
                    // res.redirect("/home.html");
                    console.log('Sucssess!');
                    res.redirect('./home.html');
                    res.status(201).send("home");
                    return;
                }else{
                    console.log('Faild!');
                    res.status(404).send("login");
                }
            };
        });

    }
    catch(error){
        console.error("error",error);
    };
};

const checkUndAddUsersingup = async (req, res) => {
    try{
        const { user_name , user_password } = req.body;

        const hashpassword = await bcrypt.hash(user_password, saltRounds); 

        pool.query(queries.addUser, [user_name , hashpassword], (error, result) =>{
            if(error)throw error;
            res.status(200).send("ok");
        })

        pool.query(queries.getUser ,[user_name , user_password] ,(error, results) => {
            if(results.rows.length){
                res.send("Username and Password already exists!").status(401);
                return next();
            }

            const DBusername = results.rows.user_name;
            if(DBusername === user_name){
                res.send("Username is already exist").send(401);
            }

        });
    }catch(error){
        console.error('error',error);
    }

};

const getTeilnehmerData = async (req, res) => {
    try{

    await pool.query(queries.getTeilnehmer, async (error , results) =>{
        if(error) throw error;
        res.status(201).json(results.rows);
    })
    
    }catch(error){
        console.error('error',error);
    }
}

const getDozentenData = async (req, res) => {
    try{

    await pool.query(queries.getDozenten, async (error , results) =>{
        if(error) throw error;
        res.status(201).json(results.rows);
    })
    
    }catch(error){
        console.error('error',error);
    }
}




module.exports = {
    getUserLogin,
    checkUndAddUsersingup,
    getTeilnehmerData,
    getDozentenData
};