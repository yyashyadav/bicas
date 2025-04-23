const SurveillanceSystem = artifacts.require("SurveillanceSystem");

module.exports = function(deployer) {
  deployer.deploy(SurveillanceSystem);
}; 