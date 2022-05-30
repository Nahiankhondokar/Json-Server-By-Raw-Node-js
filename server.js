import http from 'http';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';



// environment setup 
dotenv.config();
let PORT = process.env.SERVER_PORT;


// get all data
let students_json = readFileSync('./data/students.json').toString();
let students_obj = JSON.parse(students_json);


// http server create
http.createServer((req, res) => {

    // Request manage
    if( req.url === '/api/students' && req.method === 'GET' ){

        // get all students request
        res.writeHead(200, { 'content-type' : 'application/json' });
        res.end(students_json);

    }else if( req.url.match(/\/api\/students\/[0-9]{1,}/) && req.method === 'GET' ){

        // single data request
        let id = req.url.split('/')[3];
        if(students_obj.some(data => data.id == id)){
            console.log(true);
        }
        


        res.writeHead(200, { 'content-type' : 'application/json' });
        res.end('okay');


    }else{
        res.writeHead(200, { 'content-type' : 'application/json' });
        res.end(JSON.stringify({
            "error" : "Data Not Found"
        }));
    }




}).listen(PORT, () => {
    console.log(`node js server is running ON ${PORT}. . . `);
});




