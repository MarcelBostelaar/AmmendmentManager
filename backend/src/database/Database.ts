import mysql, { Pool, Query } from "mysql2";
import { promisify } from "util";

export default class MySqlDatabaseConnector{
    private pool : Pool;
    constructor(config) {
        this.pool = mysql.createPool(config);
    }

    async closeConnection() {
        await this.pool.end();
    }

    async executeSQL(sql, values = []){
        let pool = this.pool;
        let query = new Promise(
            function(onResolve, onReject){
                let x = pool.query(sql, values, 
                    function(err, results, fields) {
                        if(err){
                            onReject(err);
                            return;
                        }
                        onResolve(results);
                    }
                  );
            }
        )
        return await query;
    }
}

