import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    //  Mengambil header 
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Jika user tidak mengirim token maka akan kosong dan sebaliknya 

    // Cek token 
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.sendStatus(403);

        req.email = decoded.email;

        next();
    })
}