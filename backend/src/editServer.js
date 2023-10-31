/*
class editServer
    save function, which overwrites the existing file in the folder, then uses the add and commit and push function to push it to the remote
    publish function, which calls the save function, then adds the hash to the ammendments table in the database as a public commit, with a foreign key to the current user
*/

class EditServer {
    /**
     * 
     * @param {*} remote Remote to clone from
     * @param {*} startingpointHash Hash of the commit in the repository from which to start working
     * @param {*} database connection to the database
     * @param {*} user The user which this class instance serves
     * @param {*} makeNewBranch Whether or not to make this chain of changes into a new branch, of to append the changes to it. Can only be false if the commit in question is the final commit in the branch.
     */
    constructor(remote, startingpointHash, database, user, isNewBranch) {
        
        this.tempGitFolder = createTempFolder(startingpointHash, isNewBranch);
        this.database = database;
        this.currentUser = user;
    }

    save(files) {
        files.forEach(file => {
            let filePath = path.join(this.tempGitFolder.getFolderName(), file.name);
            fs.writeFileSync(filePath, file.content);
        });
        this.tempGitFolder.add(".");
        this.tempGitFolder.commit(`Updated ${", ".join(files.map(x => x.name))}`);
        this.tempGitFolder.pull();
        if(this.tempGitFolder.hasMergeConflicts()){
            this.tempGitFolder.add(".");
            this.tempGitFolder.commit("Merged conflicts");
        }
        this.tempGitFolder.push();
        //TODO add to database 
    }

    publish(fileName, fileContent) {
        this.save(fileName, fileContent);
        const latestCommitHash = this.tempGitFolder.getCurrentHash();

        this.database.addToAmendmentsTable({
            user: this.currentUser,
            commitHash: latestCommitHash
        });
    }
}