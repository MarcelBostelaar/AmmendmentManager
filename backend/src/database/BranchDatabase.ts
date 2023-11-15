import MySqlDatabaseConnector from "./Database.js";

export class BranchDatabase {
    private connector;
    constructor(connector: MySqlDatabaseConnector) {
        this.connector = connector;
    }


    async AddBranch(branchID, parentID, PrimaryDocument, PrimaryExplanatoryDocument) {
        throw new Error("Method not implemented.");
    }

    async userHasEditRightsOnBranch(branchID, userID) {
        throw new Error("Method not implemented.");
    }

    async userHasAdminRightsOnBranch(branchID, userID) {
        throw new Error("Method not implemented.");
    }

    /**
     *
     * @param {*} branchID
     * @param {*} userID
     * @param {*} role 0 remove, 1 normal, 2 owner
     */
    async changeUserBranchPermission(branchID, username, role) {
        throw new Error("Method not implemented.");
    }

    async registerCommit(branchID, hash) {
        throw new Error("Method not implemented.");
    }

    async changeCommitVisibility(Hash, isPublic) {
        throw new Error("Method not implemented.");
    }

    /**
     *
     * @param {*} Hash
     * @param {*} status accepted rejected pending
     */
    async changeCommitAcceptationStatus(Hash, status) {
        throw new Error("Method not implemented.");
    }
}
