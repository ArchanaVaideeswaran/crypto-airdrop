import { ethers } from "hardhat";
import { generateLeaf, generateTree, Recipient } from "./merkle-tree-generator";
import path from "path";
import * as fs from "fs";
const { accounts } = require("../airdrop.json");

async function main() {
    console.log("\n----------Initializing MerkleAirdrop----------\n");

    const [...users] = await ethers.getSigners();
    const sender = users[0];

    let network = (await ethers.provider.getNetwork()).name;
    network = network == "unknown" ? "localhost" : network;

    const TokenXP = require(`../build/${network}/TokenXP.json`);
    const token = await ethers.getContractAt("TokenXP", TokenXP.address);

    // const decimals = await token.decimals();
    const decimals = 18;
    let recipients: Recipient[] = [];
    if (network == "goerli") {
        for (let i = 0; i < accounts.length; i++) {
            const address = accounts[i].address;
            const value = ethers.utils
                .parseUnits(accounts[i].value, decimals)
                .toString();
            recipients.push({ address, value });
        }
    } else if (network == "localhost") {
        const amount = ethers.utils.parseUnits("10", decimals).toString();
        for (let i = 1; i <= 5; i++) {
            const user = users[i];
            recipients.push({
                address: user.address,
                value: amount,
            });
        }
    }
    const merkleTree = generateTree(recipients);
    const merkleRoot = merkleTree.getHexRoot();

    // const Airdrop = require(`../build/${network}/MerkleAirdrop.json`);
    // const airdrop = await ethers.getContractAt(
    //     "MerkleAirdrop",
    //     Airdrop.address
    // );

    // const balance = await token.balanceOf(sender.address);
    // let tx: any = await token.approve(airdrop.address, balance);
    // await tx.wait();

    // tx = await airdrop
    //     .initialize(sender.address, token.address, merkleRoot)
    //     .catch((err) => {
    //         console.log(err);
    //     });
    // await tx.wait();

    console.log("\n----------MerkleAirdrop Initialized----------\n");
    console.log({
        sender: sender.address,
        token: token.address,
        merkleRoot: merkleRoot,
    });

    // store proofs in proofs.json
    let proofs: any[] = [];
    for (let i = 0; i < recipients.length; i++) {
        let leaf = generateLeaf(recipients[i].address, recipients[i].value);
        let proof = {
            address: recipients[i].address,
            proof: merkleTree.getHexProof(leaf),
        };
        proofs.push(proof);
    }
    const outputPath: string = path.join(__dirname, `../proofs-${network}.json`);
    try {
        fs.writeFileSync(
            outputPath,
            JSON.stringify({
                proofs,
            })
        );
    } catch (error) {
        console.log(error);
    }
}

main();
