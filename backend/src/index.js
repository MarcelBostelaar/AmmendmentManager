import { mainGitFolder } from './Backend/config.js';
import { BareGitFolder } from './Backend/gitwrapper.js';
import { Startup } from './Backend/startupchecks.js';
import express from 'express';
import { isDev } from './Backend/util.js';
import fs from "fs";
const app = express();

if(isDev){
    //Allows debugger to attach at start of the script
    await new Promise(resolve => setTimeout(resolve, 1000));
}

//Pre startup checks
await Startup();


//backend app
app.get('/', (req, res) =>
    res.json({ message: "Docker is ez bruh"})
);
 
const port = process.env.PORT || 8080;

//temp

if(fs.existsSync("/main")){
    fs.rmSync("/main", {recursive: true})
}
BareGitFolder.CloneGit("/", mainGitFolder).then(x => x.pull())

//end temp

app.listen(port, () => console.log(`App is listening on localhost:${port}`))