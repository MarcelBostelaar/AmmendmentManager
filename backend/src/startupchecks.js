import fs from "fs";
import { mainGitFolder, tempFolder, workingspace } from "./config.js";
import { isDev } from "./util.js";
import { BareGitFolder } from "./gitwrapper.js";
import { deflateSync } from "zlib";
import { database } from "./globals.js";
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
        BareGitFolder.InitializeNew(mainGitFolder);
    }
    if(!fs.existsSync(tempFolder)){
        console.log("==Making temporary folder");
        fs.mkdirSync(tempFolder, {recursive: true});
    }
}

async function DatabaseCheck(){
    database = new Database(dbConfig(true));
    if(await database.isFreshInstall()){
        console.log("Fresh install detected, building tables.");
        await database.buildTables();
    }
    database.closeConnection();
    database = new Database(dbConfig(false));
}

export async function Startup(){
    // await DatabaseCheck();
    await PopulateWorkingSpace();
}
