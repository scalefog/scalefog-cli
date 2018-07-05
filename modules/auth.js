const config = require("./cliconf");
const prompt = require("prompt");
const request = require("request");
const user = require("./user");
const exec = require("child_process").exec;
var updatekey = function (token) {
  var key = user.getKey();
  if (key) {
    let url = config.API_URL + "account/addkey/";
    request.post({
        url: url,
        headers: {
          Authorization: "Bearer " + token
        },
        form: {
          sshkey: key
        }
      },
      function optionalCallback(err, httpResponse, body) {
        //body = JSON.parse(body);
        console.log(body);
        prompt.stop();
      }
    );
  }
};
var keycheck = function () {
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

function authenticate(username, password) {
  return new Promise((resolve, reject) => {
    let url = config.API_URL + "account/getToken";

    request.post({
        url: url,
        form: {
          username,
          password
        }
      },
      function optionalCallback(err, httpResponse, body) {
        body = JSON.parse(body);
        if (err || httpResponse.statusCode != 200 || body.success == "false") {
          reject(body.message);
        } else {
          resolve(body.token);
        }
      }
    );
  });
}

function register(username, email, password) {
  return new Promise((resolve, reject) => {
    let url = config.API_URL + "account/register";
    request.post({
        url: url,
        form: {
          username,
          email,
          password
        }
      },
      function optionalCallback(err, httpResponse, body) {
        body = JSON.parse(body);
        if (body.success === false) {
          for (error in body.errors) {
            console.log(body.errors[error]);
          }
        } else {
          console.log("User has been created");
        }
        prompt.stop();
      }
    );
  });
}

function logout() {
  user.deleteConfig();
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
        register(result.username, result.email, result.password);
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
        authenticate(result.username, result.password)
          .then(token => {
            console.log("You are now logged in as " + result.username);
            user.writeUser(token);
            keycheck();
            updatekey(token);
          })
          .catch(err => {
            console.log(err);
          });
      }
    });
  });
}

module.exports = {
  login,
  logout,
  signup
};