import { mainGitFolder } from './config.js';
import { GitObject } from './gitwrapper.js';
import { Startup } from './startupchecks.js';
import express from 'express';
import { isDev } from './util.js';
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
GitObject.CloneGit("/", mainGitFolder).then(x => x.pull())

//end temp

app.listen(port, () => console.log(`App is listening on localhost:${port}`))