import { ethers } from "hardhat";
import { storeContract } from "./store-contract";

async function main() {
    console.log("\n----------Deploying MerkleAirdrop----------\n");

    const [deployer] = await ethers.getSigners();
    console.log("Deployer: ", deployer.address);

    const Airdrop = await ethers.getContractFactory("MerkleAirdrop");
    const airdrop = await Airdrop.deploy();
    await airdrop.deployed();

    console.log("\n----------Deployed MerkleAirdrop----------\n");
    console.log("MerkleAirdrop Token deployed at: ", airdrop.address);

    storeContract(
        airdrop.address,
        JSON.parse(String(airdrop.interface.format("json"))),
        "MerkleAirdrop"
    );
}

main();
