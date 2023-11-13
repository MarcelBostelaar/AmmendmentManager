import mysql from "mysql2";

export default class MySqlDatabaseConnector{
    private pool;
    constructor(config) {
        this.pool = mysql.createPool(config);
    }

    async closeConnection() {
        await this.pool.end();
    }

    async executeSQL(sql, values = []){
        const connection = await this.pool.getConnection();
        console.log('Connected to the MySQL server.');
     
        const [rows, fields] = await connection.execute(sql, values);

        connection.release();
        return rows;
    }
}

