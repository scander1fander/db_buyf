module.exports = (sequelize, Sequelize) => {
    const Session = sequelize.define("session", {});
    return Session;
};    