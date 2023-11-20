// import { mainGitFolder } from './config.js';
// import { BareGitFolder } from './gitwrapper.js';
import cookieParser from 'cookie-parser';
import { Startup } from './startupchecks.js';
import express from 'express';
import { isDev } from './util.js';
import fs from "fs";
import {register, login, logout, logoutSpecificToken, changePassword, changePasswordForgotten, massCreateAccounts} from "./loginsystem/endpoints.js";
import bodyParser from "body-parser";
import session from "express-session";
import { AuthProtect } from './loginsystem/authentication.js';

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SECRETSESSIONKEY,
    resave: false,
    saveUninitialized: false,
}));

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
app.get("/getdocument", (req, res) => res.json({ message: "Not implemented. Check for published nature and authorization"}))
app.get("/getsupporters", (req, res) => res.json({ message: "Not implemented. Check for published nature and authorization"}))

app.post("/login", login);
app.post("/register", register);
app.post("/logout", logout);
app.post("/logoutSpecicificToken", logoutSpecificToken);
app.post("/changePassword", changePassword);
app.post("/changePasswordForgotten", changePasswordForgotten);
app.post("/massCreateAccounts", AuthProtect(massCreateAccounts, "Admin"));

//General error handling
app.use(function(err, req, res, next) {
    // formulate an error response here
    console.log(err);
    res.status(500).send("Internal server error")
});


const port = process.env.PORT || 8080;

//temp

if(fs.existsSync("/main")){
    fs.rmSync("/main", {recursive: true})
}
// BareGitFolder.CloneGit("/", mainGitFolder).then(x => x.pull())

//end temp

app.listen(port, () => console.log(`App is listening on localhost:${port}`))