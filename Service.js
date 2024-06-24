// import fileService from "./fileService.js";
// import sqlite3 from 'sqlite3';

// let sql;

// class Service {
//     async create(post, picture) {
//         const fileName = fileService.saveFile(picture);
//         const createdPost = await Post.create({...post, picture: fileName});
//         return createdPost;
//     }

//     async getAll() {
//         const posts = await Post.find();
//         return posts;
//     }
//     async getOne(id) {
//         if (!id) {
//             throw new Error('не указан ID')
//         }
//         const post = await Post.findById(id);
//         return post;
//     }

//     async update(post) {
//         if (!post._id) {
//             throw new Error('не указан ID')
//         }
//         const updatedPost = await Post.findByIdAndUpdate(post._id, post, {new: true})
//         return updatedPost;
//     }

//     async delete(id) {
//             if (!id) {
//                 throw new Error('не указан ID')
//             }
//             const post = await Post.findByIdAndDelete(id);
//             return post;
//     }



//     async Test() {
//         const db = new sqlite3.Database("./Federation.db", sqlite3.OPEN_READWRITE, (err) => {
//             if (err) return console.error(err.message);
//         }); 

//         // Федерация
//         sql = `CREATE TABLE IF NOT EXISTS Federations(
//             Federation_ID INTEGER PRIMARY KEY AUTOINCREMENT, 
//             Federation_Name TEXT, 
//             Organizational_and_legal_form TEXT, 
//             Sport_Name TEXT, 
//             Sport_Code TEXT, 
//             Legal_address TEXT, 
//             Phone_Number TEXT, 
//             Email TEXT, 
//             OGRN TEXT, 
//             INN TEXT, 
//             KPP TEXT, 
//             Bank_Account TEXT, 
//             Correspondent_Account TEXT, 
//             BIK TEXT
//         )`;
//         db.run(sql);

//         sql = `INSERT INTO Federations(
//             Federation_Name, 
//             Organizational_and_legal_form, 
//             Sport_Name, 
//             Sport_Code, 
//             Legal_address, 
//             Phone_Number, 
//             Email, 
//             OGRN, 
//             INN, 
//             KPP, 
//             Bank_Account, 
//             Correspondent_Account, 
//             BIK) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`;
//         db.run(sql, [
//             "Региональная спортивная федерация спортивного ориентирования Ленинградской области",
//             "Общественной организации",
//             "Спортивное ориентирование",
//             "0830011811Я",
//             "188664, Ленинградская обл, р-н Всеволожский, ГП Токсово, ул Спортивная, 6",
//             "+7(912)123-67-89",
//             "rufso@mail.ru",
//             "1094700000097",
//             "4703110935",
//             "470501001",
//             "40703810355400000135",
//             "30101810500000000429",
//             "044030653",
//         ], err => {
//             if (err) return console.error(err.message);
//         });

//         sql = `SELECT * FROM Federations`;
//         db.all(sql, [], (err, rows) => {
//             if (err) return console.error(err.message);
//             rows.forEach((row) => {
//                 console.log('строка:');
//                 console.log(row);
//                 return row;
//             })
            
//         })

//     }
// }


// export default new Service();