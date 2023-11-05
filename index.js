import express from "express";
import db from "./config/Database.js";
import Users from "./models/UserModel.js";

const app = express();

// Kondisi database
try {
    await db.authenticate();
    console.log('Database terkoneksi dengan baik...');

    // await Users.sync(); -> JIka belum ada table di database
} catch (error) {
    console.log(error);
}

app.listen(5000, ()=> console.log('Server berjalan dengan normal di port 5000'));
