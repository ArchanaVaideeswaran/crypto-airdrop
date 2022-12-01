import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumberish } from "ethers";
import { MerkleAirdrop } from "../typechain-types";
import { Recepient, generateTree, generateLeaf } from "./merkle-tree-generator";
import MerkleTree from "merkletreejs";
const contract = require("../build/localhost/MerkleAirdrop.json");

let owner: SignerWithAddress;
let accounts: SignerWithAddress[];
let airdrop: MerkleAirdrop;
let amount: BigNumberish;
let merkleTree: MerkleTree;
let badTree: MerkleTree;

async function main() {
    [ owner, ...accounts ] = await ethers.getSigners();
    console.log("Deployer: ", owner);

    const decimals = 18;
    amount = ethers.utils.parseUnits("10", decimals);
    merkleTree = getTree(0, 5);
    badTree = getTree(5, 10);
    
    for(let i = 2; i < 7; i++) {
        const user = accounts[i];
        let leaf = generateLeaf(
            user.address, 
            amount.toString(),
        );
        let proof;
        if(i < 5) {
            proof = merkleTree.getHexProof(leaf);
        }
        else {
            proof = badTree.getHexProof(leaf);
        }
        await claim(user.address, amount, proof);
    }
}

async function claim(to: string, amount: BigNumberish, proof: string[]) {
    airdrop = await ethers.getContractAt("MerkleAirdrop", contract.address);
    let tx;
    try {
        tx = await airdrop.claim(
            to, 
            amount, 
            proof
        ).catch((err: any) => {throw(err)});

        tx = await tx.wait();
        console.log('token claimed successfully');
        console.log('tx: ', tx);
    }
    catch(err) {
        console.log(err);
    }
}

function getTree(start: number, end: number) {
    let recepients: Recepient[] = [];

    for(let i = start; i < end; i++) {
        const user = accounts[i];
        recepients.push({
            address: user.address, 
            value: amount.toString(),
        });
    }
    return generateTree(recepients);
}

main();