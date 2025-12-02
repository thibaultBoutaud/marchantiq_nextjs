require("dotenv").config();

const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const userRoute = require("./routes/users_routes");
const mailRoute = require("./routes/mails_routes");
const itemRoute = require("./routes/items_routes");
const newRoute = require("./routes/news_routes");
const threadRoute = require("./routes/threads_routes");
const path = require("path");


app.use(cookieParser());
app.use(express.json());

app.use(cors({
    origin: `http://localhost:3000`, // Assure-toi que l'origin du frontend est correctement spécifié
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,  // Permet l'envoi des cookies  
}));


app.use("/api/auth", userRoute);
app.use("/api/mails", mailRoute);
app.use("/api/items", itemRoute);
app.use("/api/news", newRoute);
app.use("/api/threads", threadRoute);
app.use("/api/images/items", express.static(path.join(__dirname, "uploads/pictures/items")));
app.use("/api/images/news", express.static(path.join(__dirname, "uploads/pictures/news")));
app.use("/api/images/threads", express.static(path.join(__dirname, "uploads/pictures/threads")));
module.exports = app;