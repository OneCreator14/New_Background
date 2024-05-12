import Post from "./Post.js";
import fileService from "./fileService.js";
import sqlite3 from 'sqlite3';

class Service {
    async create(post, picture) {
        const fileName = fileService.saveFile(picture);
        const createdPost = await Post.create({...post, picture: fileName});
        return createdPost;
    }

    async getAll() {
        const posts = await Post.find();
        return posts;
    }
    async getOne(id) {
        if (!id) {
            throw new Error('не указан ID')
        }
        const post = await Post.findById(id);
        return post;
    }

    async update(post) {
        if (!post._id) {
            throw new Error('не указан ID')
        }
        const updatedPost = await Post.findByIdAndUpdate(post._id, post, {new: true})
        return updatedPost;
    }

    async delete(id) {
            if (!id) {
                throw new Error('не указан ID')
            }
            const post = await Post.findByIdAndDelete(id);
            return post;
    }



    async Test() {
        const db = new sqlite3.Database("./test.db", sqlite3.OPEN_READWRITE, (eer) => {
            if (err) return console.error(err.message);
        }); 

        sql = `CREATE TABLE test(id INTEGER PRIMARY KEY, first_name, last_name)`;
        db.run(sql);

        sql = `INSERT INTI test (first_name, last_name) VALUES (?,?)`;
        db.run(sql, ["mike", "nikelson"], err => {
            if (err) return console.error(err.message);
        });

        sql = `SELECT * FROM test`;
        db.all(sql. [], (err, rows) => {
            if (err) return console.error(err.message);
            rows.forEach((row) => {
                console.log(row);
            })
        })

    }
}


export default new Service();