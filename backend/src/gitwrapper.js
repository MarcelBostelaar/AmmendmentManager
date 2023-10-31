import fs from "fs";
import { globalemail, globalname } from "./config.js";
export const mainBranchName = "main";
import path from 'path';
import {spawnSync} from 'child_process';

function executeGitCommand(workingDirectory, ...args){
    const result = spawnSync('git', args, {cwd: workingDirectory});
    if (result.error) {
        // Handle the error
        console.error('Error executing command:', result.error);
        return result.stdout.toString();
    }

    if (result.status !== 0) {
        // The command exited with a non-zero status, indicating an error
        console.error(`Command exited with status ${result.status}`);
        return result.stdout.toString();
    }
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
            fs.mkdirSync(folder, {recursive: true});
        }

        if (fs.readdirSync(folder).length != 0)/*check if folder is empty*/ {
            throw new Error(`Folder not empty, cant create a bare git repo here: '${folder}'.`);
        }
        executeGitCommand(folder, "init", "--bare");
        return new BareGitFolder(folder);
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
        executeGitCommand(this.#folder, "init");
        executeGitCommand(this.#folder, "remote", "add", "origin", remote);
        executeGitCommand(this.#folder, "fetch", "origin", hashToClone);
        executeGitCommand(this.#folder, "reset", "origin", hashToClone);
    }

    destructor() {
        fs.rmSync(this.#folder, {recursive: true})
     }

    getCurrentHash(){
        return executeGitCommand(this.#folder, "rev-parse", "HEAD");
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
        executeGitCommand(this.#folder, "commit", "-m", `"${commitName}"`, `--author="${authorInfo}"`);
        return this.getCurrentHash();
    }

    add(nameOrWildcard) {
        let result = executeGitCommand(this.#folder, "add", nameOrWildcard);
        return result;
    }

    push() {
        let result = executeGitCommand(this.#folder, "push");
        return result;
    }
}
