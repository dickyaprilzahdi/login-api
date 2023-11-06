import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Menampilkan Pengguna
export const getUsers = async (req, res) => {
    try {
        const users = await Users.findAll({
            attributes: ['id', 'name', 'email']
        });
        res.json(users);
    } catch (error) {
        console.log(error)
    }
}

// Membuat pengguna
export const Register = async (req, res) => {
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

// Membuat pengguna
export const Login = async (req, res) => {
    try {
        const user = await Users.findAll({
            where: {
                email: req.body.email
            }
        });

        const match = await bcrypt.compare(req.body.password, user[0].password);

        // Jika pass tidak cocok 
        if (!match) return res.status(400).json({ msg: "Password cocok" });

        // Jika cocok
        const userId = user[0].id;
        const name = user[0].name;
        const email = user[0].email;
        const accessToken = jwt.sign({ userId, name, email }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '15s'
        });
        const refreshToken = jwt.sign({ userId, name, email }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        });

        await Users.update({ refresh_token: refreshToken }, {
            where: {
                id: userId
            }
        });

        // http online cookie yang dikirim ke client 
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000

            // secure: true -> Berguna ketika sudah dihosting 
        });

        res.json({ accessToken });

    } catch (error) {
        res.status(404).json({ msg: "Email tidak ditemukan..." });
    }
}

// Membuat Logout
export const Logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    // Kondisi untuk cookies
    if (!refreshToken) return res.sendStatus(204); // jika tidak ada konten

    const user = await Users.findAll({
        where: {
            refresh_token: refreshToken
        }
    });

    if (!user[0]) return res.sendStatus(204);

    const userId = user[0].id;
    await Users.update({ refresh_token: null }, {
        where: {
            id: userId
        }
    });
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}