import fs from "fs";
import { GetGitObject, mainBranchName } from "./gitwrapper.js";

const mainGitFolder = "/working-space/main";
const tempFolder = "/working-space/temp";

/**
 * Populates the working space with git and neccecary folders
 */
async function PopulateWorkingSpace(){
    if(!fs.existsSync(mainGitFolder)){
        console.log("Making main git folder");
        fs.mkdirSync(mainGitFolder);
    }
    if(!fs.existsSync(tempFolder)){
        console.log("Making temporary folder");
        fs.mkdirSync(tempFolder);
    }

    if(fs.readdirSync(mainGitFolder).length === 0){
        console.log("Making main git branch");
        //make main git folder
        await GetGitObject(mainGitFolder).init(true, {"--initial-branch": mainBranchName});
        console.log("Creating child and pushing to remote.");
        let tempworkingdir = tempFolder + "/temppusher"
        if(fs.existsSync(tempworkingdir)){
            fs.rmSync(tempworkingdir, {recursive: true, force: true})
        }
        fs.mkdirSync(tempworkingdir)


        let tempGit = GetGitObject(tempworkingdir);
        await tempGit.clone(mainGitFolder);
        fs.writeFileSync(tempworkingdir + "/main/.gitignore", '');
        await tempGit.add(".gitignore").commit('Created workspace').push('origin', mainBranchName);
        fs.rmSync(tempworkingdir, {recursive: true, force: true})

        //temp test
        fs.mkdirSync(tempworkingdir)
        let tempGit2 = GetGitObject(tempworkingdir);
        await tempGit2.clone(mainGitFolder);
    }
}

export async function Startup(){
    await PopulateWorkingSpace();
}
