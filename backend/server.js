const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");

const app = express();


// ============================================
// MIDDLEWARE
// ============================================

app.use(cors());

app.use(express.json());


// ============================================
// ROUTES
// ============================================

app.use("/api", userRoutes);


// ============================================
// MONGODB CONNECTION
// ============================================

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {

        console.log(
            "MongoDB Atlas Connected Successfully"
        );

    })
    .catch((error) => {

        console.error(
            "MongoDB Connection Failed:",
            error.message
        );

    });


// ============================================
// TEST ROUTE
// ============================================

app.get("/", (req, res) => {

    res.json({
        message: "Backend server is running"
    });

});


// ============================================
// SERVER
// ============================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(
        `Server running on http://localhost:${PORT}`
    );

});