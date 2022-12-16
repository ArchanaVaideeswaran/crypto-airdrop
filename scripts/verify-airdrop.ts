import hre from "hardhat";
const Airdrop = require("../build/goerli/MerkleAirdrop.json");

const main = async () => {
    await hre.run("verify:verify", {
        address: Airdrop.address,
        contract: "contracts/MerkleAirdrop.sol:MerkleAirdrop",
    });
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
