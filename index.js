import express from 'express';
// import router from './router.js';
import fileUpload from 'express-fileupload';

import mysql from "mysql";

import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

import cors from 'cors';

const PORT = 5000;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let Data = [1];

app.use(cors());
app.use(express.json());
app.use(express.static('static'));
app.use(fileUpload({}));
app.set('json spaces', 2)
//app.use('/api', router);

let query = "SELECT * FROM Sportsmen";


// Render the document (Replace {first_name} by John, {last_name} by Doe, ...)
// const Data = {
//     date: "24 июня 2024",
//     number: "1",
//     category: "«первый спортивный разряд»",
//     sport: "Дзюдо",
//     district: "г. Кингисепп",
//     name: "Чиобану Елизавета",
// }

// Тестовая площкадка запросов

const urlencodedParser = express.urlencoded({ extended: false });

app.get("/test", function (_, response) {
    // response.sendFile(__dirname + "/Result/Sportsmen/Decision.docx");
    console.log("получили запрос")
    response.download(__dirname + "/Result/Sportsmen/Decision.docx");
});

app.post("/test", urlencodedParser, function (request, response) {
    const { test1, test2 } = request.body;
    console.log("Тело запроса:" + test1 + " " + test2);
    response.send(request.body);
});

// Тестовая площадка закрывается, просьба всем на выход


// Запросы запросецы
app.get("/downloadc", function (_, response) {
    // response.sendFile(__dirname + "/Result/Sportsmen/Decision.docx");
    console.log("получили запрос")
    response.download(__dirname + "/Requests/25-06-2024/1.pdf");
});

app.get("/dbtable", function (_, response) {
    console.log("получили запрос get на /dbtable");

    connection.connect(err => {
        if (err) {
            console.log(err);
            return err;
        }
        else {
            console.log("Соединение открыто");
        }
    })

    // президиум
    let query = "SELECT * FROM Presidium";
    connection.query(query, (_, result) => {
        // for (var i = 0; i < 8; i++) {
        // }
        // result.forEach((element, i) => {

        //     Data.push({
        //         full_name: element['Full_Name'],
        //         post: element['Post']
        //     });
        // });

        // console.log("Финал:");
        // console.log(JSON.stringify(result));

        response.send(result);
    });

    connection.end(err => {
        if (err) {
            console.log(err);
            return err;
        }
        else {
            console.log("Соединение закрыто");
        }
    })
});

app.get('/sportsmandoc', function (_, res) {
    const connection = mysql.createConnection({
        host: "hukibeho.beget.app",
        port: "3306",
        user: "default-db",
        database: "default-db",
        password: "Paniola12!",
    });

    connection.connect(err => {
        if (err) {
            console.log(err);
            return err;
        }
        else {
            console.log("Соединение открыто");
        }
    })

    let query = "SELECT * FROM Sportsmen WHERE Federation_ID = 1";
    
    connection.query(query, (_, result) => {
        const Data = {
            full_name1: '',
            full_name2: '',
            full_name3: '',
            full_name4: '',
            full_name5: '',
        };
        
        console.log(result[0]['Full_Name']);

        Data.full_name1 = result[0]['Full_Name'];
        Data.full_name2 = result[1]['Full_Name'];
        Data.full_name3 = result[2]['Full_Name'];
        Data.full_name4 = result[3]['Full_Name'];
        Data.full_name5 = result[4]['Full_Name'];
    

        console.log(Data);
        res.send(Data);

        connection.end(err => {
            if (err) {
                console.log(err);
                return err;
            }
            else {
                console.log("Соединение закрыто");
            }
        })
    });

})


app.get('/downloadrequest', function (_, res) {
    const file = __dirname + `/Result/Sportsmen/Request.docx`;
    res.download(__dirname + "/Result/Sportsmen/Request.docx");
});

app.get('/downloaddecision', function (_, res) {
    const file = __dirname + `/Result/Sportsmen/Decision.docx`;
    res.download(file);
});



app.post('/createrequest', async (req, res) => {
    const { federation, full_name, birth_date, person_document, category, competition_status, sport, competition_name, result } = req.body;
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
    console.log(Data);
    CreateDoc("/Templates/Sportsmen/", "Request.docx", Data, "/Result/Sportsmen/", "Request.docx");
});


app.post('/createdecision', async (req, res) => {
    const { date, number, category, name, sport, district } = req.body;
    const Data = {
        date, number, category, name, sport, district
    }

    CreateDoc("/Templates/Sportsmen/", "Decision.docx", Data, "/Result/Sportsmen/", "Decision.docx");
    const file = `/Result/Sportsmen/Decision.docx`;
    res.download(file);
});


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

































async function startApp() {
    try {
        app.listen(PORT, () => console.log('Сервер запустился на порте ' + PORT));
    }
    catch (e) {
        console.log(e.message);
    }
}
startApp();