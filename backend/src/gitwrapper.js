import fs from "fs";
import { globalemail, globalname } from "./config.js";
export const mainBranchName = "main";

const fs = require('fs');
const path = require('path');

function executeGitCommand(command, workingDirectory) {
    const { spawnSync } = require('child_process');
    const result = spawnSync(command);
    return result.stdout.toString();
}

export class BareGitFolder {
    #folderLocation;
    constructor(folderLocation) {
        this.#folderLocation = folderLocation;
    }

    getFolderPath() {
        return this.#folderLocation;
    }

    static InitializeNew(folder) {
        if (!fs.existsSync(folder)) {
            throw new Error(`Folder '${folder}' does not exist.`);
        }

        const gitFolderPath = path.join(folder, '.git');
        if (fs.existsSync(gitFolderPath)) {
            throw new Error(`A Git repository already exists in '${folder}'.`);
        }

        fs.mkdirSync(gitFolderPath);
        executeGitCommand('git --git-dir=' + gitFolderPath + ' init --bare');

        return new BareGitFolder(gitFolderPath);
    }

    static CloneGit(into, from) {
        if (!fs.existsSync(into)) {
            throw new Error(`Folder '${into}' does not exist.`);
        }

        const gitFolderPath = path.join(into, '.git');
        if (fs.existsSync(gitFolderPath)) {
            throw new Error(`A Git repository already exists in '${into}'.`);
        }

        executeGitCommand(`git clone --bare ${from} ${gitFolderPath}`);

        return new BareGitFolder(gitFolderPath);
    }
}

export class TempGitfolder {
    #folder
    constructor(intoFolder, remote, hashToClone) {
        /**
         * Creates and clones a new Git working folder into the given location.
         * Removes folder with files once folder is lost.
         */
        this.#folder = intoFolder;
        fs.mkdirSync(this.#folder, {recursive: true});
        executeGitCommand(`git init`, this.#folder);
        executeGitCommand(`git remote add origin ${remote}`, this.#folder);
        executeGitCommand(`git fetch origin ${hashToClone}`, this.#folder);
        executeGitCommand(`git reset origin ${hashToClone}`, this.#folder);
        // let clonedFolder = path.join(into, path.basename(from, '.git'));
    }

    destructor() {
        fs.rmSync(this.#folder, {recursive: true})
     }

    getCurrentHash(){
        return executeGitCommand("git rev-parse HEAD");
    }

    getFolderName() {
        return this.#folder;
    }

    commit(commitName, committerName = globalname, committerEmail = globalemail) {
        /**
         * Commits the currently staged items with a given name, committer name and committer email
         * Returns the commiit hash of the created commit.
         */
        let authorInfo = `${committerName} <${committerEmail}>`;
        executeGitCommand(`git commit -m "${commitName}" --author="${authorInfo}"`, this.#folder);
        return this.getCurrentHash();
    }

    add(nameOrWildcard) {
        let result = executeGitCommand('git add ' + nameOrWildcard, this.#folder);
        return result;
    }

    push() {
        let result = executeGitCommand('git push', this.#folder);
        return result;
    }
}
