import fs from "fs";
import { cloneGit, initializeNewGit, mainBranchName } from "./gitwrapper.js";
import { mainGitFolder, tempFolder } from "./config.js";
/**
 * Populates the working space with git and neccecary folders
 */
async function PopulateWorkingSpace(){
    // if(fs.existsSync("/" + workingspace)){
    //     fs.rmSync("/" + workingspace, {recursive: true})
    // }
    if(!fs.existsSync(mainGitFolder)){
        console.log("Making main git folder");
        fs.mkdirSync(mainGitFolder, {recursive: true});
    }
    if(!fs.existsSync(tempFolder)){
        console.log("Making temporary folder");
        fs.mkdirSync(tempFolder, {recursive: true});
    } 

    if(fs.readdirSync(mainGitFolder).length === 0){
        console.log("Making main git branch");
        //make main git folder
        await initializeNewGit(mainGitFolder)

        console.log("Creating child and pushing to remote.");
        let tempworkingdir = tempFolder + "/temppusher"
        fs.mkdirSync(tempworkingdir)

        let tempGit = await cloneGit(tempworkingdir, mainGitFolder)
        fs.writeFileSync(tempGit.getFolderName() + "/.gitignore", '');
        await tempGit.add(".gitignore")
        .then(x => x.commit('Created workspace'))
        .then(x => x.push())
        fs.rmSync(tempworkingdir, {recursive: true, force: true})
    }
}

export async function Startup(){
    await PopulateWorkingSpace();
}
