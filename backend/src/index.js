import { mainGitFolder } from './config.js';
import { BareGitFolder } from './gitwrapper.js';
import cookieParser from 'cookie-parser';
import { Startup } from './startupchecks.js';
import express from 'express';
import { isDev } from './util.js';
import fs from "fs";
import { DummyAuth } from './login.js';
import bodyParser from "body-parser";

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());

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
app.post('/login', DummyAuth);
app.get("/getdocument", (req, res) => res.json({ message: "Not implemented. Check for published nature and authorization"}))
app.get("/getsupporters", (req, res) => res.json({ message: "Not implemented. Check for published nature and authorization"}))

const port = process.env.PORT || 8080;

//temp

if(fs.existsSync("/main")){
    fs.rmSync("/main", {recursive: true})
}
// BareGitFolder.CloneGit("/", mainGitFolder).then(x => x.pull())

//end temp

app.listen(port, () => console.log(`App is listening on localhost:${port}`))