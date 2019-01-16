const auth = require("../modules/auth");
const app = require("../modules/app");
const templates = require("../modules/templates");
const commander = require("commander");
const packageJson = require("../package.json");
commander.version(packageJson.version, "-v, --version");
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
    .command("ls")
    .description("List all your instances")
    .action(function () {
        app.list();
    });
commander
    .command("regions")
    .description("List all available regions")
    .action(function () {
        app.regions();
    });
commander
    .command("create [name]")
    .description("Create a new instance")
    .option("-r,--region [region]", "To Select region")
    .action(function (name, options) {
        app.create(name, options);
    });
commander
    .command("delete <name>")
    .description("delete instance")
    .action(function (name, cmd) {
        app._delete(name);
    });
commander.command("list-templates")
    .description("Currently available templates")
    .action(async function () {
        templates("list-templates").then((results) => {
            console.log(results)
        });
    });
commander.command("template [template-name]")
    .description('Retrieve the template Dockerfile.')
    .action(async function (name) {
        templates("template", {
            name
        }).then((results) => {
            console.log(results)
        });
    });
commander
    .command("*")
    .description("")
    .action(async function () {
        console.log("Invalid command");
        commander.help();
    });
commander.parse(process.argv);