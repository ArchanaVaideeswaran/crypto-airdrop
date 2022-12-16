import { ethers } from "hardhat";
import { storeContract } from "./store-contract";

async function main() {
    console.log("\n----------Deploying TokenXP----------\n");

    const [sender] = await ethers.getSigners();
    console.log("Sender: ", sender.address);

    const Token = await ethers.getContractFactory("TokenXP");
    const token = await Token.deploy();
    await token.deployed();

    console.log("TokenXP deployed at: ", token.address);

    storeContract(
        token.address,
        JSON.parse(String(token.interface.format('json'))),
        "TokenXP"
    );
}

main();
