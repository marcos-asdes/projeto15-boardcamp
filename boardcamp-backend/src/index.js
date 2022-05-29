import express, { json } from 'express'; // server
import cors from 'cors'; // Cross-Origin Resource Sharing
import dotenv from 'dotenv'; // environment variables

//import router from './routes/router.js'

const app = express(); // create a server

dotenv.config();

app.use(json()); // middleware
app.use(cors()); // middleware
//app.use(router);

const port = process.env.PORT || 4000; // establishing the port -> production or development

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});