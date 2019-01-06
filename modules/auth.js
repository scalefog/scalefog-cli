const prompt = require("prompt"),
    Node = require("scalefog-api").scalefog,
    user = require("./user"),
    nodeapi = new Node(),
    exec = require("child_process").exec;
const keycheck = function () {
    var key = user.getKey();
    if (!key) {
        prompt.start();
        prompt.get(
            [{
                name: "sshkeygen",
                description: "Do you want to autogenerate ssh key [y|n] ?",
                required: true
            }],
            function (err, results) {
                if (results.sshkeygen === "y") {
                    exec("ssh-keygen -f .ssh/id_rsa -t rsa -N ''");
                }
                prompt.stop();
            }
        );
    }
};
var updatekey = function (token) {
    var key = user.getKey();
    if (key) {
        nodeapi.setToken(token);
        nodeapi.addRsa(key, result => {});
    }
}

function register(username, password, email) {
    return new Promise((resolve, reject) => {
        nodeapi.register(username, password, email, result => {
            if (result.success == true) {
                console.log("User has been created");
            } else {
                reject(result.message);
            }
            prompt.stop();
        });
    });
}

function authenticate(username, password) {
    return new Promise((resolve, reject) => {
        nodeapi.getToken(username, password, result => {
            if (result.accesstoken) {
                resolve(result.accesstoken);
            } else {
                reject("invalid credentials");
            }
        });
    });
}

function signup() {
    return new Promise((resolve, reject) => {
        const schema = {
            properties: {
                username: {
                    required: true
                },
                email: {
                    required: true
                },
                password: {
                    hidden: true
                }
            }
        };

        prompt.start();
        prompt.get(schema, function (err, result) {
            if (err) {
                reject(err);
            } else {
                register(result.username, result.password, result.email);
            }
        });
    });
}

function login() {
    return new Promise((resolve, reject) => {
        const schema = {
            properties: {
                username: {
                    required: true
                },
                password: {
                    hidden: true
                }
            }
        };
        prompt.start();
        console.log("Enter your Scalefog credentials.");
        prompt.get(schema, function (err, result) {
            if (err) {
                reject(err);
            } else {
                authenticate(result.username, result.password).then((token) => {
                    console.log("You are now logged in as " + result.username);
                    user.writeUser(token);
                    updatekey(token);
                    resolve(token);
                }).catch(err => {
                    reject(err);
                });
            }
        });
    });
}

function logout() {
    user.deleteConfig();
}
module.exports = {
    login,
    signup,
    logout
};