import { ethers } from "hardhat";
import { Recepient, generateTree } from "./merkle-tree-generator";
import * as fs from "fs";


async function main() {
    console.log("\n----------Deploying Merkle Airdrop Token----------\n");

    const [ owner, ...accounts ] = await ethers.getSigners();
    console.log("Deployer: ", owner);

    let recepients: Recepient[] = [];
    const decimals = 18;
    const length = accounts.length > 5 ? 5 : accounts.length;
    for(let i = 0; i < length; i++) {
        const user = accounts[i];
        recepients.push({
            address: user.address, 
            value: ethers.utils.parseUnits("10", decimals).toString()
        });
    }

    const merkleRoot = generateTree(recepients);

    console.log("main(): Merkle root: ", merkleRoot);

    const Airdrop = await ethers.getContractFactory("MerkleAirdrop");
    const airdrop = await Airdrop.deploy(merkleRoot);
    await airdrop.deployed();

    console.log("\n----------Deployed Merkle Airdrop Token----------\n");
    console.log("Merkle Airdrop Token deployed at: ", airdrop.address);
}

main();