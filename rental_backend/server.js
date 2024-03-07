const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());


app.listen(8081, () => {
    console.log('Server is listening on port 8001');
})