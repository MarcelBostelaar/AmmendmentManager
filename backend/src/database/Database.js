import {mysql} from "mysql2";
import {GenerateRandomToken} from "../util.js";

class Database {
    pool;
    constructor(config) {
        this.pool = mysql.createPool(config);
    }

    async closeConnection() {
        await this.pool.end();
    }

    async AddBranch(branchID, parentID, PrimaryDocument, PrimaryExplanatoryDocument){

    }

    async userHasEditRightsOnBranch(branchID, userID){

    }

    async userHasAdminRightsOnBranch(branchID, userID){

    }

    /**
     * 
     * @param {*} branchID 
     * @param {*} userID 
     * @param {*} role 0 remove, 1 normal, 2 owner
     */
    async changeUserBranchPermission(branchID, username, role){

    }

    async registerCommit(branchID, hash){

    }

    async changeCommitVisibility(Hash, isPublic){

    }

    /**
     * 
     * @param {*} Hash 
     * @param {*} status accepted rejected pending
     */
    async changeCommitAcceptationStatus(Hash, status){

    }

    async userExists(email){
        const query = 'SELECT COUNT(*) as count FROM Users WHERE Email = ?';
        const rows = await this.#executeSQL(query, [email]);
        const userCount = rows[0].count;
        return userCount > 0;
    }
    /**
     * 
     * @param {String} email 
     * @param {String} password 
     * @returns Newly generated token if succesfull or null if not able to autheticate
     */
    async authenticateUser(email, password){
        const getPasswordQuery = 'SELECT Password, ID FROM Users WHERE Email = ?';
        const userRows = await this.#executeSQL(getPasswordQuery, [email]);

        if (userRows.length === 0) {
            //user not found
            return null;
        }
        const user = userRows[0];

        const hashedPassword = user.Password;

        const passwordMatch = await bcrypt.compare(password, hashedPassword);

        if (!passwordMatch) {
            //invalid password
            return null;
        }

        const token = GenerateRandomToken();
        let validUntil = Date.now() + Date(process.env.TOKENEXPIRATIONTIME);
        await this.#executeSQL('INSERT INTO Tokens (UserID, TokenValue, ExpiryDate) VALUES (?, ?, ?)', [token, user.ID, validUntil]);
        return token;
    }

    async destroyToken(token){
        await this.#executeSQL('DELETE FROM Tokens WHERE TokenValue = ?', [token]);
    }
    
    async tokenExists(token){
        const result = await this.#executeSQL(
            'SELECT COUNT(*) as count FROM Tokens WHERE TokenValue = ? AND ExpiryDate > CURRENT_TIMESTAMP()',
            [token]);
        return result.count == 1;
    }

    async #encryptPassword(password){
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    }

    async registerUser(email, password){
        const hashedPassword = await this.#encryptPassword(password)

        const insertUserQuery = 'INSERT INTO Users (Email, Password, Role) VALUES (?, ?, 0)';
        await this.#executeSQL(insertUserQuery, [email, hashedPassword]);
    }

    async changePassword(email, newPassword){
        const hashedPassword = await this.#encryptPassword(newPassword)

        const insertUserQuery = `UPDATE Users
        SET Password = ?
        WHERE Email = ?;`;
        await this.#executeSQL(insertUserQuery, [hashedPassword, email]);
    }

    /**
     * 
     * @param {String} token 
     * @returns Null is none found, an object with an ID, Email and Role attribute if found.
     */
    async getTokensUser(token){
        const sql = `SELECT Users.Email, Users.Role, Users.ID
        FROM Users
        INNER JOIN Tokens ON Users.ID = Tokens.UserID
        WHERE Tokens.TokenValue = ? AND Tokens.ExpiryDate > CURRENT_TIMESTAMP();`
        let result = this.#executeSQL(sql, [token]);
        if(result.length == 0){
            return null;
        }
        return result[0];
    }

    async #executeSQL(sql, values = []){
        const connection = await pool.getConnection();
        console.log('Connected to the MySQL server.');
     
        const [rows, fields] = await connection.execute(sql, values);

        connection.release();
        return rows;
    }
}