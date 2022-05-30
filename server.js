import http from 'http';
import { readFileSync, writeFileSync } from 'fs';
import dotenv from 'dotenv';
import { newDataId } from './lib/functions.js';



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

        // single data GET request
        let id = req.url.split('/')[3];
        if(students_obj.some(data => data.id == id)){
            res.writeHead(200, { 'content-type' : 'application/json' });
            res.end(JSON.stringify(students_obj.find(data => data.id == id)));
        }else{
            res.writeHead(200, { 'content-type' : 'application/json' });
            res.end(JSON.stringify({
                "message" : "Student not found"
            }));
        }

    }else if( req.url.match(/\/api\/students\/[0-9]{1,}/) && req.method === 'DELETE' ){

        // single data DELETE request
        let id = req.url.split('/')[3];
        if(students_obj.some(data => data.id == id)){

            let del_data = students_obj.filter(data => data.id != id);
            writeFileSync('./data/students.json', JSON.stringify(del_data));

            res.writeHead(200, { 'content-type' : 'application/json' });
            res.end(JSON.stringify({
                "message" : "Student Deleted"
            }));

            
        }else{
            res.writeHead(200, { 'content-type' : 'application/json' });
            res.end(JSON.stringify({
                "message" : "Student not found"
            }));
        }

    }else if( req.url === '/api/students' && req.method === 'POST' ){

        // POST Request manages
        let data = '';
        req.on('data', (chunk) => {
            data += chunk.toString();
        });
        req.on('end', () => {

            let { name, skill, location } = JSON.parse(data);
            students_obj.push({
                id  : newDataId(students_obj),
                name : name,
                skill : skill,
                location : location
            });

            writeFileSync('./data/students.json', JSON.stringify(students_obj));

        });

        res.writeHead(200, { 'content-type' : 'application/json' });
        res.end(JSON.stringify({
            "message" : "Data Added"
        }));

    }else if( req.url.match(/\/api\/students\/[0-9]{1,}/) && req.method === 'PUT' || req.url.match(/\/api\/students\/[0-9]{1,}/) && req.method === 'PATCH' ){

        // put, patch request
        let id = req.url.split('/')[3];
        if(students_obj.some(data => data.id == id)){

            // update data get
            let data = '';
            req.on('data', (chunk) => {
                data += chunk.toString();
            });
            req.on('end', () => {

                let { name, skill, location } = JSON.parse(data);
                let index = students_obj.findIndex(data => data.id == id);

                students_obj[index] = {
                    id : id,
                    name : name,
                    skill : skill,
                    location : location
                };
              
                writeFileSync('./data/students.json', JSON.stringify(students_obj));

            });




            res.writeHead(200, { 'content-type' : 'application/json' });
            res.end(JSON.stringify({
                "message" : "Student Updated"
            }));

            
        }else{
            res.writeHead(200, { 'content-type' : 'application/json' });
            res.end(JSON.stringify({
                "message" : "Student not found"
            }));
        }

    }else{
        res.writeHead(200, { 'content-type' : 'application/json' });
        res.end(JSON.stringify({
            "error" : "Data Not Found"
        }));
    }




}).listen(PORT, () => {
    console.log(`node js server is running ON ${PORT}. . . `);
});




