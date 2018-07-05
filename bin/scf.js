#!/usr/bin/env node

const auth = require("../modules/auth");
const app = require("../modules/app");
const commander = require("commander");
commander.version("1.0.0", "-v, --version");
commander
  .command("login")
  .description("Login to your Scalefog account")
  .action(function () {
    auth.login();
  });
commander
  .command("logout")
  .description("Logout of your account")
  .action(function () {
    auth.logout();
  });
commander
  .command("register")
  .description("Create new user")
  .action(function () {
    auth.signup();
  });

commander
  .command("create [name]")
  .description("Create a new instance")
  .option("-r,--region [region]", "To Select region")
  .action(function (name, options) {
    app.create(name, options);
  });
commander.command("git:remote <name>").action(function (name, cmd) {
  console.log("Added git remote");
});
commander
  .command("ls")
  .description("List all your instances")
  .action(function () {
    app.list();
  });

commander
  .command("restart <name>")
  .description("restart instance")
  .action(function (name, cmd) {
    app._restart(name);
  });
commander
  .command("start <name>")
  .description("start instance")
  .action(function (name, cmd) {
    app._start(name);
  });
commander
  .command("stop <name>")
  .description("stop instance")
  .action(function (name, cmd) {
    app._stop(name);
  });
commander
  .command("delete <name>")
  .description("delete instance")
  .action(function (name, cmd) {
    app._delete(name);
  });

commander
  .command("*")
  .description("")
  .action(async function () {
    console.log("Invalid command");
    commander.help();
  });
commander.parse(process.argv);