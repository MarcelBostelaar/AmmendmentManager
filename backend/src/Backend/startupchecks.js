import fs from "fs";
import { mainGitFolder, tempFolder, workingspace } from "./config.js";
import { isDev } from "./util.js";
import { BareGitFolder } from "./gitwrapper.js";
/**
 * Populates the working space with git and neccecary folders
 */
async function PopulateWorkingSpace(){
    if (isDev) {
        console.log("==Deleting files")
        if(fs.existsSync("/" + workingspace)){
            console.log("==Deleted workspace")
            fs.rmSync("/" + workingspace, {recursive: true})
        }
    }
    
    if(!fs.existsSync(mainGitFolder)){
        console.log("==Making main git folder");
        fs.mkdirSync(mainGitFolder, {recursive: true});
        console.log("==Making main git branch");
        await BareGitFolder.InitializeNewBareGit(mainGitFolder);
    }
    if(!fs.existsSync(tempFolder)){
        console.log("==Making temporary folder");
        fs.mkdirSync(tempFolder, {recursive: true});
    }
}

export async function Startup(){
    await PopulateWorkingSpace();
}
