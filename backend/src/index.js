import { Startup } from './startupchecks.js';
import express from 'express';
const app = express();

//Pre startup checks
await Startup();


//backend app
app.get('/', (req, res) =>
    res.json({ message: "Docker is ez bruh"})
);

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`App is listening on localhost:${port}`))