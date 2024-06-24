import express from 'express';
// import router from './router.js';
import fileUpload from 'express-fileupload';

import mysql from "mysql";

import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';


const PORT = 5000;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static('static'));
app.use(fileUpload({}));
//app.use('/api', router);

const connection = mysql.createConnection({
    host: "hukibeho.beget.app",
    port: "3306",
    user: "default-db",
    database: "default-db",
    password: "Paniola12!",
});




function CreateRequest() {
    const Data = {

    }
    CreateDoc("/Templates/Sportsmen/", "Request.docx", Data, "/Result/Sportsmen/", "Request.docx");
}

function CreateDecision() {
    const Data = {

    }
    CreateDoc("/Templates/Sportsmen/", "Decision.docx", Data, "/Result/Sportsmen/", "Decision.docx");
}



//
function CreateDoc(template_path, template_name, Data, result_path, result_name) {
    // Load the docx file as binary content
    const content = fs.readFileSync(
        path.resolve(__dirname + template_path, template_name),
        "binary"
    );

    const zip = new PizZip(content);

    // This will parse the template, and will throw an error if the template is
    // invalid, for example, if the template is "{user" (no closing tag)
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    });

    doc.render(Data);

    // Get the zip document and generate it as a nodebuffer
    const buf = doc.getZip().generate({
        type: "nodebuffer",
        // compression: DEFLATE adds a compression step.
        // For a 50MB output document, expect 500ms additional CPU time
        compression: "DEFLATE",
    });

    // buf is a nodejs Buffer, you can either write it to a
    // file or res.send it with express for example.
    fs.writeFileSync(path.resolve(__dirname + result_path, result_name), buf);
}
//



connection.connect(err => {
    if (err) {
        console.log(err);
        return err;
    }
    else {
        console.log("Соединение открыто");

    }
})

let query = "SELECT * FROM Sportsmen";
const Data = {
    date: "",
    number: "",
    category: "",
    sport: "",
    district: "",
    name: "",
}

connection.query(query, (err, result, field) => {
    //console.log(err);
    console.log(result[0]);
    //console.log(query);

    Data.full_name = result[0]['Full_Name'];
    Data.birth_date = result[0]['Birth_date'];
    Data.person_document = result[0]['Person_document_data'];


    CreateDoc("/Templates/Sportsmen/", "Request.docx", Data, "/Result/Sportsmen/", "Request.docx");

});



// Render the document (Replace {first_name} by John, {last_name} by Doe, ...)
// const Data = {
//     date: "24 июня 2024",
//     number: "1",
//     category: "«первый спортивный разряд»",
//     sport: "Дзюдо",
//     district: "г. Кингисепп",
//     name: "Чиобану Елизавета",
// }


connection.end(err => {
    if (err) {
        console.log(err);
        return err;
    }
    else {
        console.log("Соединение закрыто");

    }
})


app.get('/downloadrequest', function (req, res) {
    const file = `Result/Sportsmen/Request.docx`;
    res.download(file); // Set disposition and send it.
});

app.get('/downloaddecision', function (req, res) {
    const file = `Result/Sportsmen/Decision.docx`;
    res.download(file); // Set disposition and send it.
});



app.post('/createrequest', async (req, res) => {
    const {federation, full_name, birth_date, person_document, category, competition_status, sport, competition_name, result} = req.body;
    const Data = {
        federation,
        full_name,
        birth_date,
        person_document, 
        category, 
        competition_status, 
        sport, 
        competition_name, 
        result
    }
    console.log("Я моргнул что было");
    CreateDoc("/Templates/Sportsmen/", "Request.docx", Data, "/Result/Sportsmen/", "Request.docx");
    const file = `Result/Sportsmen/Request.docx`;
    res.download(file);
});


app.post('/createdecision', async (req, res) => {
    const {date, number, category, name, sport, district} = req.body;
    const Data = {
        date, number, category, name, sport, district
    }
    console.log("Я моргнул что было x2");
    CreateDoc("/Templates/Sportsmen/", "Decision.docx", Data, "/Result/Sportsmen/", "Decision.docx");
    const file = `Result/Sportsmen/Decision.docx`;
    res.download(file);
});



async function startApp() {
    try {
        app.listen(PORT, () => console.log('Сервер запустился на порте ' + PORT));
    }
    catch (e) {
        console.log(e.message);
    }
}
startApp();