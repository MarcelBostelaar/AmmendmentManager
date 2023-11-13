import Database from "./database/Database.js";
export let database = new Database({
    host: process.env.DB_HOST,
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_DATABASE,
    password: process.env.MYSQL_PASSWORD,
    connectionlimit: process.env.DBCONNECTIONLIMIT
});