import { ethers } from "hardhat";
import { BigNumberish } from "ethers";
import { generateLeaf, generateTree, Recepient } from "./merkle-tree-generator";
const contract = require("../build/goerli/MerkleAirdrop.json");
const { accounts } = require("../airdrop.json");

async function main() {
    const [owner] = await ethers.getSigners();
    console.log("Deployer: ", owner.address);

    const decimals = 18;
    let recepients: Recepient[] = [];
    for (let i = 0; i < accounts.length; i++) {
        const user = accounts[i];
        // console.log("user: ", user);
        recepients.push({
            address: user.address,
            value: ethers.utils.parseUnits(user.value, decimals).toString(),
        });
        // console.log("recepient: ", recepients[i]);
    }
    const merkleTree = generateTree(recepients);
    const merkleRoot = merkleTree.getHexRoot();

    console.log("main(): Merkle root: ", merkleRoot);

    for (let i = 0; i < accounts.length; i++) {
        const user = accounts[i];
        const amount = ethers.utils.parseUnits(user.value, decimals);
        const leaf = generateLeaf(user.address, amount.toString());
        const proof = merkleTree.getHexProof(leaf);

        // console.log("user, leaf, proof: \n", user, leaf, proof);
        await claim(user.address, amount, proof);
    }
}

async function claim(to: string, amount: BigNumberish, proof: string[]) {
    const airdrop = await ethers.getContractAt(
        "MerkleAirdrop",
        contract.address
    );
    let tx;
    try {
        tx = await airdrop.claim(to, amount, proof).catch((err: any) => {
            throw err;
        });

        tx = await tx.wait();
        console.log("token claimed successfully");
        console.log("tx: ", tx);
    } catch (err) {
        console.log(err);
    }
}

main();
