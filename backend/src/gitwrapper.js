import {simpleGit} from "simple-git";
import fs from "fs";
import { globalemail } from "./config.js";
export const mainBranchName = "main";

export class GitObject{
    #simpleGitObject
    #folderName 
    constructor(folder){
        if(!fs.existsSync(folder + "/.git") && !fs.existsSync(folder + "/HEAD")){
            throw Error(`Folder ${folder} is not a git folder or does not exist.`)
        }
        this.#simpleGitObject = GitObject.#getGitObject(folder)
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

    async pull(){
        await this.#simpleGitObject.pull(["--ff-only"]); //fast forward only for the current time.
        return this;
    }

    static #getGitObject(folder){
        let options = {
            baseDir: folder,
            binary: 'git',
            maxConcurrentProcesses: 6,
            trimmed: false,
        };
        return simpleGit(options);
    }
    
    static async InitializeNewBareGit(folder){
        let randomname = "folder " + Math.random().toString();
        fs.mkdirSync(randomname);
        console.log("==Creating new bare git")
        await GitObject.#getGitObject(folder).init(true).branch(["-m", mainBranchName]);
        console.log("==Created new bare git")
        await GitObject.#getGitObject(randomname)
        .init(false)
        .addRemote("origin", folder);
        fs.writeFileSync(randomname + "/.gitignore", '');
        let x = await new GitObject(randomname).add(".gitignore")
        .then(x => {console.log("==Added gitignore"); return x})
        .then(x => x.commit('Created workspace'))
        .then(x => {console.log("==Committed first commit"); return x});
        // .then(x => x.#getGitObject)
        await GitObject.#getGitObject(randomname).push(["--set-upstream", "origin", "master"])
        console.log("==Pushed first commit");
        fs.rmSync(randomname, {recursive: true, force: true})
        return new GitObject(folder)
    }

    static async InitializeNewGit(folder, bare){
        await GitObject.#getGitObject(folder).init(bare).branch(["-m", mainBranchName]);
        return new GitObject(folder)
    }
    
    static async CloneGit(into, from){
        let tempGit = GitObject.#getGitObject(into);
        await tempGit.clone(from);
        let gitName = from.split("/").at(-1);
        let newObject = new GitObject(into + "/" + gitName)
        await (newObject.#simpleGitObject
        .fetch(["origin"])
        .branch({"--set-upstream-to": mainBranchName})
        .remote(["set-head", mainBranchName]))
        return newObject
    }
}

