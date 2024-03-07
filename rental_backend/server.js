const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const multer = require('multer');
const path = require('path');


app.use(cors());
app.use(express.json());


app.listen(8081, () => {
    console.log('Server is listening on port 8001');
})

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "renting"
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });