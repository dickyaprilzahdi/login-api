import { Sequelize } from "sequelize";

const db = new Sequelize('login_db', 'root', '', {
    host: "localhost", 
    dialect: "mysql"
});

export default db;