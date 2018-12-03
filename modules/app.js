const config = require("./cliconf");
const user = require("./user");
const request = require("request");
const AsciiTable = require('ascii-table');
const exec = require("child_process").exec;
var fs = require("fs"),
  exists = fs.existsSync || path.existsSync,
  path = require("path");
var deleteApp = function (name, token) {
  let url = config.API_URL + "instances/delete/" + name;
  request.get({
      url: url,
      headers: {
        Authorization: "Bearer " + token
      }
    },
    function optionalCallback(err, httpResponse, body) {
      body = JSON.parse(body);
      console.log(body.message);
    }
  );
};
var restartApp = function (name, token) {
  let url = config.API_URL + "instances/restart/" + name;
  request.get({
      url: url,
      headers: {
        Authorization: "Bearer " + token
      }
    },
    function optionalCallback(err, httpResponse, body) {
      body = JSON.parse(body);
      console.log(body.message);
    }
  );
};
var stopApp = function (name, token) {
  let url = config.API_URL + "instances/stop/" + name;
  request.get({
      url: url,
      headers: {
        Authorization: "Bearer " + token
      }
    },
    function optionalCallback(err, httpResponse, body) {
      body = JSON.parse(body);
      console.log(body.message);
    }
  );
};
var startApp = function (name, token) {
  let url = config.API_URL + "instances/start/" + name;
  request.get({
      url: url,
      headers: {
        Authorization: "Bearer " + token
      }
    },
    function optionalCallback(err, httpResponse, body) {
      body = JSON.parse(body);
      console.log(body.message);
    }
  );
};
var createApp = function (appname, token) {
  let url = config.API_URL + "instances/create";
  request.post({
      url: url,
      headers: {
        Authorization: "Bearer " + token
      },
      form: {
        appname
      }
    },
    function optionalCallback(err, httpResponse, body) {
      body = JSON.parse(body);
      if (body.success == "true") {
        console.log("Creating " + body.app_name + "... done");
        console.log(body.app_url + " | " + body.git_repo);
        if (exists(".git")) {
          exec("git remote add scalefog " + body.git_repo);
          console.log("Git remote scalefog added");
        }
      } else {
        console.log(body.message);
      }
    }
  );
};
var list = function () {
  if (user.getToken()) {
    var token = user.getToken();
    let url = config.API_URL + "instances/";
    request.get({
        url: url,
        headers: {
          Authorization: "Bearer " + token
        }
      },
      function optionalCallback(err, httpResponse, body) {
        body = JSON.parse(body);
        if (body.message) {
          console.log(body.message);
        } else {
          var instanceList = new AsciiTable('Your apps');
          instanceList.setHeading('App name', 'Url');
          var instances = body.DATA;
          for (var i = 0, len = instances.length; i < len; i++) {
            //console.log(instances[i].name);
            instanceList.addRow(instances[i].name, 'https://' + instances[i].name + '.scf.sh');
          }
          console.log(instanceList.toString());
        }
      }
    );
  }
};

var create = function (name, option) {
  if (user.getToken()) {
    var token = user.getToken();
    createApp(name, token);
  }
};
var _restart = function (name) {
  if (user.getToken()) {
    var token = user.getToken();
    restartApp(name, token);
  }
};
var _stop = function (name) {
  if (user.getToken()) {
    var token = user.getToken();
    stopApp(name, token);
  }
};
var _start = function (name) {
  if (user.getToken()) {
    var token = user.getToken();
    startApp(name, token);
  }
};
var _delete = function (name) {
  if (user.getToken()) {
    var token = user.getToken();
    deleteApp(name, token);
  }
};

module.exports = {
  list,
  create,
  _delete,
  _restart,
  _stop,
  _start
};