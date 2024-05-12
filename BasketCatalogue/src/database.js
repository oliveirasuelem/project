const mysql= require("promise-mysql");


const connection=mysql.createConnection({
    HOST:"localhost",
    Database:"project",
    user:"root",
    password:"Manotas.78"
})

const getConnection=()=> connection;

module.exports = {
    getConnection
}
 