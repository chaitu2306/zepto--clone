// // server.js
// const express = require("express");
// const mysql = require("mysql2");
// const bodyParser = require("body-parser");
// const cors = require("cors");

// const app = express();
// const PORT = 3000;

// // Middleware
// app.use(cors());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// // MySQL Connection
// const db = mysql.createConnection({
//   host: "localhost",         // change if you're using RDS
//   user: "root",              // your MySQL username
//   password: "Divya@2.0",  // your MySQL password
//   database: "zepto_clone"
// });

// db.connect(err => {
//   if (err) {
//     console.error("Database connection failed:", err);
//   } else {
//     console.log("Connected to MySQL database");
//   }
// });

// // API to handle signup POST request
// app.post("/signup", (req, res) => {
//   const { username, email, password } = req.body;

//   if (!username || !email || !password) {
//     return res.status(400).send("All fields are required.");
//   }

//   const sql = "INSERT INTO signup_users (username, email, password) VALUES (?, ?, ?)";
//   db.query(sql, [username, email, password], (err, result) => {
//     if (err) {
//       if (err.code === "ER_DUP_ENTRY") {
//         return res.status(409).send("Email already registered.");
//       }
//       console.error("Insert error:", err);
//       return res.status(500).send("Something went wrong.");
//     }
//     res.send("Signup successful!");
//   });
// });

// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });
// server.js
const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

// ✅ Serve static HTML files from "public" folder
app.use(express.static("public"));

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Divya@2.0",
  database: "zepto",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

// ✅ Home route
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/signup.html"); // show signup page by default
});

// ✅ Signup API
app.post("/signup", (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const sql = "INSERT INTO signup_users (username, email, password) VALUES (?, ?, ?)";
  db.query(sql, [username, email, password], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "Email already registered." });
      }
      console.error("Insert error:", err);
      return res.status(500).json({ message: "Something went wrong." });
    }
    res.status(201).json({ message: "Signup successful!" });
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const sql = "SELECT * FROM signup_users WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error("Login query error:", err);
      return res.status(500).json({ message: "Something went wrong." });
    }

    if (results.length > 0) {
      const user = results[0]; // ✅ Get the username from DB
      return res.status(200).json({ message: "Login successful!", username: user.username });
    } else {
      return res.status(401).json({ message: "Invalid email or password." });
    }
  });
});


// ✅ Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
