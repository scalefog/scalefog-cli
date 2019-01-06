const Node = require("scalefog-api").scalefog,
    user = require("./user"),
    nodeapi = new Node();
const AsciiTable = require('ascii-table');
const regions = function () {
    nodeapi.get_regions(regions => {
        var regionsList = new AsciiTable('Regions');
        for (var i = 0, len = regions.length; i < len; i++) {
            regionsList.addRow(regions[i].name);
        }
        console.log(regionsList.toString());
    });
}
const create = function (appname, region = '') {
    if (user.getToken()) {
        nodeapi.setToken(user.getToken());
        nodeapi.CreateInstance(appname, region, result => {
            if (result.success == true) {
                console.log("Creating " + appname + "... done");
            } else {
                console.log(result.message);
            }
        });
    }
}
const list = function () {
    if (user.getToken()) {
        nodeapi.setToken(user.getToken());
        nodeapi.getInstances(instances => {
            var instanceList = new AsciiTable('Your apps');
            instanceList.setHeading('App name', 'Url');
            for (var i = 0, len = instances.length; i < len; i++) {
                instanceList.addRow(instances[i].name, 'https://' + instances[i].name + '.scf.sh');
            }
            console.log(instanceList.toString());
        });
    }
}
const _delete = function (name) {
    if (user.getToken()) {
        nodeapi.setToken(user.getToken());
        nodeapi.DeleteInstance(name, result => {
            if (result.success == true) {
                console.log(name + "has been deleted");
            }
        });
    }
};
module.exports = {
    list,
    regions,
    create,
    _delete
};