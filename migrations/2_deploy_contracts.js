var Token = artifacts.require("./Mercurium.sol");
var Orders = artifacts.require("./Orders.sol");

module.exports = function(deployer) {
  deployer.deploy(Mercurium);
};

module.exports = function(deployer) {
  deployer.deploy(Orders);
};