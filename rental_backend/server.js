const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const multer = require('multer');
const path = require('path');

app.use(cors());
app.use(express.json());

app.listen(8081, () => {
    console.log('Server is listening on port 8081');
});

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


app.post('/insert', upload.array('image', 3), (req, res) => {
    console.log(req.body); // Log received text fields
    console.log(req.files); // Log received files
    
    const { title, description, address, postcode, email, contact, price } = req.body;
   

    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No images uploaded.' });
    }

    // Assuming you're only handling one image for simplicity
    const image1 = req.files[0]?.filename; // Using optional chaining

    // SQL query adjusted for 7 placeholders and corresponding values
    const sql = "INSERT INTO property (`title`, `description`, `address`, `postcode`, `email`, `image1`, `contact`, `price`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

    const values = [title, description, address, postcode, email, image1, contact, price];

    db.query(sql, values, (err, data) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal Server Error', details: err.message });
        }
        console.log('Data inserted successfully:', data);
        return res.json({ success: true, data: data });
    });
});
