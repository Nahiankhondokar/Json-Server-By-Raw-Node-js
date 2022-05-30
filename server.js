import http from 'http';
import dotenv from 'dotenv';



// environment setup 
dotenv.config();
let PORT = process.env.SERVER_PORT;


// http server create
http.createServer((req, res) => {



}).listen(PORT, () => {
    console.log(`node js server is running ON ${PORT}. . . `);
});




