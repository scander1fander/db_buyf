module.exports = {
    HOST: "localhost",
    PORT: "8080",
    USER: "postgres",
    PASSWORD: "17122004",
    DB: "BUYF",
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};