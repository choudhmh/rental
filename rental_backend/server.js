const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require('fs-extra'); // fs-extra for more utility functions

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
  // Use a temporary unique name; you will rename this file later
  filename: function (req, file, cb) {
    const tempName = "temp-" + Date.now() + path.extname(file.originalname);
    cb(null, tempName);
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

// Start the server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// Route to insert property details
app.post('/insert', upload.single('image'), (req, res) => {
  const { title, description, address, postcode, email, contact, price } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded.' });
  }

  console.log('Body:', req.body);
  console.log('File:', req.file);

  // Insert the property information, excluding the image URL for now
  const sqlInsertProperty = 'INSERT INTO property (title, description, address, postcode, email, contact, price) VALUES (?, ?, ?, ?, ?, ?, ?)';
  const valuesProperty = [title, description, address, postcode, email, contact, price];

  db.query(sqlInsertProperty, valuesProperty, async (err, result) => {
    if (err) {
      console.error('Error inserting property data:', err.message);
      // Attempt to delete the temporarily uploaded file since the DB insert failed
      await fs.unlink(req.file.path).catch(err => console.error('Error removing temporary file:', err));
      return res.status(500).json({ error: 'Internal Server Error', detail: err.message });
    }

    console.log('Property data inserted successfully:', result);
    const propertyId = result.insertId;

    const currentDate = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD

    // New filename with property ID and current date
    const newFilename = `${propertyId}-${currentDate}${path.extname(req.file.originalname)}`;
    const newPath = path.join('./uploads', newFilename);

    // Rename the uploaded file to include the property ID
    fs.rename(req.file.path, newPath, (err) => {
      if (err) {
        console.error('Error renaming file:', err);
        return res.status(500).json({ error: 'Error processing file' });
      }

      // Update your database record to include the new image path or URL
      const sqlUpdateImage = 'UPDATE property SET image1 = ? WHERE propertyID = ?';
      db.query(sqlUpdateImage, [newFilename, propertyId], (err, result) => {
        if (err) {
          console.error('Error updating property with image data:', err);
          return res.status(500).json({ error: 'Failed to update property with image', detail: err.message });
        }

        console.log('Image data updated successfully:', result);
        res.json({ success: true, message: 'Property and image data inserted successfully', data: { propertyId: propertyId, imagePath: newPath } });
      });
    });
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
    const currentDate = new Date().toISOString().slice(0, 10); // Current date in YYYY-MM-DD format
    const newFilename = `${req.params.id}-${currentDate}${path.extname(req.file.originalname)}`;
    const newPath = path.join('./uploads', newFilename);

    // Rename the uploaded file to include the property ID and current date
    fs.rename(req.file.path, newPath, (err) => {
      if (err) {
        console.error('Error renaming file:', err);
        return res.status(500).json({ error: 'Error processing file' });
      }

      // Update image1 value in the values array with the new filename
      values[5] = newFilename;

      // Execute the SQL query to update the property record
      db.query(sql, values, (err, data) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "An error occurred" });
        }

        if (data.affectedRows > 0) {
          return res.json({
            success: true,
            message: "Record updated successfully",
          });
        } else {
          return res.status(404).json({
            success: false,
            message: "Record not found or data identical",
          });
        }
      });
    });
  } else {
    // If no file is uploaded, execute the SQL query directly without updating the image
    db.query(sql, values, (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "An error occurred" });
      }

      if (data.affectedRows > 0) {
        return res.json({
          success: true,
          message: "Record updated successfully",
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Record not found or data identical",
        });
      }
    });
  }
});

  
  //Delete records
  app.delete('/delete/:id', (req, res) => {
    const sql = "DELETE FROM property WHERE propertyID = ?";
    const id = req.params.id;

    db.query(sql, [id], (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'An error occurred while executing the SQL query.' });
        }

        if (!data.affectedRows) {
            // If no rows were affected, it means there was no record with the provided ID
            return res.status(404).json({ error: 'No record found with the provided ID.' });
        }

        console.log(data);
        return res.json({ success: true, data: data });
    });
});


