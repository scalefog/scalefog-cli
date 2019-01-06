const fs = require("fs"),
    exists = fs.existsSync || path.existsSync,
    path = require("path");
const writeUser = function (token) {
    var config_file = path.join(process.env.HOME, ".scalefog.rc");
    fs.writeFileSync(config_file, token, "utf8");
    return config_file;
};
const getKey = function () {
    var key = path.join(process.env.HOME, ".ssh", "id_rsa.pub");
    if (exists(key)) {
        var rsadata = fs.readFileSync(key).toString();
        return rsadata;
    } else {
        return false;
    }
};
const getToken = function () {
    var config_file = path.join(process.env.HOME, ".scalefog.rc");
    if (exists(config_file)) {
        var token = fs.readFileSync(config_file).toString();
        return token;
    } else {
        console.log("You need to run scf login");
    }
};
const deleteConfig = function () {
    var config_file = path.join(process.env.HOME, ".scalefog.rc");
    if (exists(config_file)) {
        console.log("You have now logged out");
        fs.unlinkSync(config_file);
    } else {
        console.log("You are not logged in");
    }
};
module.exports = {
    writeUser,
    getKey,
    getToken,
    deleteConfig
};