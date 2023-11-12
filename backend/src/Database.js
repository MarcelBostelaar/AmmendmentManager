const mysql = require('mysql2');

class Database {
    constructor(config) {
        this.connection = mysql.createConnection(config);

        this.connection.connect(err => {
            if (err) {
                console.error('Error connecting to the database:', err);
                return;
            }
            console.log('Connected to MySQL database.');
        });
    }

    closeConnection() {
        this.connection.end(err => {
            if (err) {
                console.error('Error closing the database connection:', err);
                return;
            }
            console.log('Database connection closed.');
        });
    }

    registerUser(email, password){

    }

    AddBranch(branchID, parentID, PrimaryDocument, PrimaryExplanatoryDocument){

    }

    userHasEditRightsOnBranch(branchID, userID){

    }

    userHasAdminRightsOnBranch(branchID, userID){

    }

    /**
     * 
     * @param {*} branchID 
     * @param {*} userID 
     * @param {*} role 0 remove, 1 normal, 2 owner
     */
    changeUserBranchPermission(branchID, username, role){

    }

    registerCommit(branchID, hash){

    }

    changeCommitVisibility(Hash, isPublic){

    }

    /**
     * 
     * @param {*} Hash 
     * @param {*} status accepted rejected pending
     */
    changeCommitAcceptationStatus(Hash, status){

    }

    
}

/**
const dbConfig = {
    host: 'localhost',
    user: 'your_username',
    password: 'your_password',
    database: 'your_database_name'
};

// Example usage of the Database class
const myDatabase = new Database(dbConfig);
 */