const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("uploads"));

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "renting",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to database");
});

// Route to insert property details
app.post("/insert", upload.array("image"), (req, res) => {
  const { title, description, address, postcode, email, contact, price } =
    req.body;

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No images uploaded." });
  }

  const image1 = req.files[0]?.filename;

  const sql =
    "INSERT INTO property (title, description, address, postcode, email, image1, contact, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  const values = [
    title,
    description,
    address,
    postcode,
    email,
    image1,
    contact,
    price,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    console.log("Data inserted successfully:", result);
    return res.json({ success: true, data: result });
  });
});

// Route to display property details
app.get("/display", (req, res) => {
  const sql = "SELECT * FROM property";
  db.query(sql, (err, data) => {
    if (err) {
      console.error("Error retrieving data:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    console.log("Data retrieved successfully:", data);
    return res.json({ success: true, data: data });
  });
});

//Get & show Records on signup form
app.get("/getrecord/:id", (req, res) => {
  const propertyID = req.params.id; // Use propertyID instead of id
  const sql = "SELECT * FROM property WHERE propertyID = ?";
  db.query(sql, [propertyID], (err, data) => {
    if (err) {
      console.error("Error retrieving record:", err);
      return res
        .status(500)
        .json({ error: "An error occurred while fetching data" });
    }

    if (!data || data.length === 0) {
      console.log("No record found for propertyID:", propertyID);
      return res.status(404).json({ error: "Record not found" });
    }

    console.log("Record retrieved:", data);
    return res.json({ success: true, data: data });
  });
});

//Update Records
app.put("/update/:id", upload.single("image"), (req, res) => {
    let sql =
      "UPDATE property SET title = ?, description = ?, address = ?, postcode = ?, email = ?, image1 = ?, contact = ?, price = ? WHERE propertyID = ?";
    const values = [
      req.body.title,
      req.body.description,
      req.body.address,
      req.body.postcode,
      req.body.email,
      req.body.image1, // Assuming this is the file name from the client
      req.body.contact,
      req.body.price,
      req.params.id, // Correct parameter name
    ];
  
    // Check if there's a file to also update the image
    if (req.file) {
      // If a file is uploaded, replace the image1 value in the values array
      values[5] = req.file.filename; // Assuming this is the correct index for image1 in the values array
    }
  
    db.query(sql, values, (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "An error occurred" });
      }
      console.log(data);
  
      if (data.affectedRows > 0) {
        return res.json({
          success: true,
          message: "Record updated successfully",
        });
      } else {
        return res
          .status(404)
          .json({
            success: false,
            message: "Record not found or data identical",
          });
      }
    });
  });
  

  

// Start the server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
