import express from "express";
import db from "./config/Database.js";
import Users from "./models/UserModel.js";
import router from "./routes/index.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors"; // agar dapat diakses diluar domain 

dotenv.config();

const app = express();

// Kondisi database
try {
    await db.authenticate();
    console.log('Database terkoneksi dengan baik...');

    // await Users.sync(); -> JIka belum ada table di database
} catch (error) {
    console.log(error);
}

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(cookieParser());
app.use(express.json()); // Menerima data json
app.use(router); // Sebagai middleware

app.listen(5000, () => console.log('Server berjalan dengan normal di port 5000'));
