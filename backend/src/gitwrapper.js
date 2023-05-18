import {simpleGit} from "simple-git";
import fs from "fs";
import { globalemail } from "./config.js";
export const mainBranchName = "main";

class gitObject{
    #simpleGitObject
    #folderName 
    constructor(folder){
        if(!fs.existsSync(folder + "/.git")){
            throw Error(`Folder ${folder} is not a git folder or does not exist.`)
        }
        this.#simpleGitObject = GetGitObject(folder)
        this.#folderName = folder
    }

    getFolderName(){
        return this.#folderName
    }

    async add(nameOrWildcard){
        await this.#simpleGitObject.add(nameOrWildcard);
        return this
    }

    async commit(commitName, committerName, committerEmail=globalemail){
        await this.#simpleGitObject.commit(commitName, {
            '--author': `"${committerName} <${committerEmail}>"`,
         });
        return this
    }

    async push(){
        await this.#simpleGitObject.push();
        return this
    }
}

function GetGitObject(folder){
    let options = {
        baseDir: folder,
        binary: 'git',
        maxConcurrentProcesses: 6,
        trimmed: false,
    };
    return simpleGit(options);
}

export async function initializeNewGit(folder, bare){
    await GetGitObject(folder).init(bare, {"--initial-branch": mainBranchName});
    return new gitObject(folder)
}

export async function cloneGit(into, from){
    let tempGit = GetGitObject(into);
    await tempGit.clone(from);
    let gitName = from.split("/").at(-1);
    return new gitObject(into + "/" + gitName)
}