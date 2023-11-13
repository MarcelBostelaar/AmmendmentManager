import uuid4 from "uuid4";
import bcrypt from "bcrypt";
import MySqlDatabaseConnector from "../database/Database.js";

/**
 * Handles authentication, logging in of users, changing passwords, etc.
 */
export class UserAccountDatabase {
    private connector;
    constructor(connector: MySqlDatabaseConnector) {
        this.connector = connector;
    }


    async userExists(email) {
        const query = 'SELECT COUNT(*) as count FROM Users WHERE Email = ?';
        const rows = await this.connector.executeSQL(query, [email]);
        const userCount = rows[0].count;
        return userCount > 0;
    }
    /**
     *
     * @param {String} email
     * @param {String} password
     * @returns Newly generated token if succesfull or null if not able to autheticate
     */
    async authenticateUser(email: string, password: string) {
        const getPasswordQuery = 'SELECT Password, ID FROM Users WHERE Email = ?';
        const userRows = await this.connector.executeSQL(getPasswordQuery, [email]);

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

        const token = uuid4();
        let validUntil = new Date(Date.now() + new Date(process.env.TOKENEXPIRATIONTIME).getMilliseconds());
        await this.connector.executeSQL('INSERT INTO Tokens (UserID, TokenValue, ExpiryDate) VALUES (?, ?, ?)', [token, user.ID, validUntil]);
        return token;
    }

    async destroyToken(token) {
        await this.connector.executeSQL('DELETE FROM Tokens WHERE TokenValue = ?', [token]);
    }

    async tokenExists(token) {
        const result = await this.connector.executeSQL(
            'SELECT COUNT(*) as count FROM Tokens WHERE TokenValue = ? AND ExpiryDate > CURRENT_TIMESTAMP()',
            [token]);
        return result.count == 1;
    }

    private async encryptPassword(password) {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    }

    async registerUser(email, password) {
        const hashedPassword = await this.connector.encryptPassword(password);

        const insertUserQuery = 'INSERT INTO Users (Email, Password, Role) VALUES (?, ?, 0)';
        await this.connector.executeSQL(insertUserQuery, [email, hashedPassword]);
    }

    async changePassword(email, newPassword) {
        const hashedPassword = await this.connector.encryptPassword(newPassword);

        const insertUserQuery = `UPDATE Users
        SET Password = ?
        WHERE Email = ?;`;
        await this.connector.executeSQL(insertUserQuery, [hashedPassword, email]);
    }

    /**
     *
     * @param {String} token
     * @returns Null is none found, an object with an ID, Email and Role attribute if found.
     */
    async getTokensUser(token: string) {
        const sql = `SELECT Users.Email, Users.Role, Users.ID
        FROM Users
        INNER JOIN Tokens ON Users.ID = Tokens.UserID
        WHERE Tokens.TokenValue = ? AND Tokens.ExpiryDate > CURRENT_TIMESTAMP();`;
        let result = await this.connector.executeSQL(sql, [token]);
        if (result.length == 0) {
            return null;
        }
        return result[0];
    }


    async isAdmin(token: any): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    purgeAllTokens(ID: number) {
        throw new Error("Method not implemented.");
    }
}
