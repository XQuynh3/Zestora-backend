const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://xuanquynh3824:03082004@cluster0.zssggef.mongodb.net/Zestora")
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.log("MongoDB connection error: ", err));

app.get("/", (req, res) => {
    res.send("Express App is running");
});

app.listen(port, () => {
    console.log(`Server is running on Port ${port}`);
});
