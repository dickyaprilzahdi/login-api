import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";

// Menampilkan Pengguna
export const getUsers = async (req, res) => {
    try {
        const users = await Users.findAll();
        res.json(users);
    } catch (error) {
        console.log(error)
    }
}

// Membuat pengguna
export const Register = async(req, res) => {
    const { name, email, password, confPassword } = req.body;

    // Jika Pass tidak cocok 
    if (password !== confPassword) return res.status(400).json({ msg: "Pass dan Konfirmasi pass tidak sama" });

    // Jika sama
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    try {
        await Users.create({
            name: name,
            email: email,
            password: hashPassword
        });

        res.json({ msg: "Register berhasil dilakukan..." })
    } catch (error) {
        console.log(error);
    }
}