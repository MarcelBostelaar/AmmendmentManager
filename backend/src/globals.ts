import { BranchDatabase } from "./database/BranchDatabase.js";
import MySqlDatabaseConnector from "./database/Database.js";
import { UserAccountDatabase } from "./loginsystem/UserAccountDatabase.js";
export const database = new MySqlDatabaseConnector({
    host: process.env.DB_HOST,
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_DATABASE,
    password: process.env.MYSQL_PASSWORD,
    connectionlimit: process.env.DBCONNECTIONLIMIT
});
export const userAccountDatabase = new UserAccountDatabase(database);
export const branchDatabase = new BranchDatabase(database);