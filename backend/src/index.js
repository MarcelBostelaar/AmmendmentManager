import { mainGitFolder } from './config.js';
import { cloneGit } from './gitwrapper.js';
import { Startup } from './startupchecks.js';
import express from 'express';
const app = express();

 await new Promise(resolve => setTimeout(resolve, 1000));//temp

//Pre startup checks
await Startup();


//backend app
app.get('/', (req, res) =>
    res.json({ message: "Docker is ez bruh"})
);

const port = process.env.PORT || 8080;

cloneGit(".", mainGitFolder)

app.listen(port, () => console.log(`App is listening on localhost:${port}`))