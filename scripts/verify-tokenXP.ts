import hre from "hardhat";
const goerliTokenXP = require("../build/goerli/TokenXP.json");

const main = async () => {
    await hre.run("verify:verify", {
        address: goerliTokenXP.address,
        contract: "contracts/TokenXP.sol:TokenXP",
    });
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
