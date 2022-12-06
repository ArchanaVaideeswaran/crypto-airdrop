import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumberish } from "ethers";
import { ethers } from "hardhat";
import MerkleTree from "merkletreejs";
import { generateLeaf, generateTree, Recepient } from "../scripts/merkle-tree-generator";
import { MerkleAirdrop } from "../typechain-types";

describe("Merkle Airdrop Token", () => {
    let owner: SignerWithAddress;
    let users: SignerWithAddress[];
    let airdrop: MerkleAirdrop;
    let recepients: Recepient[];
    let amount: BigNumberish;
    let merkleTree: MerkleTree;
    let merkleRoot: string;
    let badRecepients: Recepient[];
    let badTree: MerkleTree;
    
    before(async () => {
        [ owner, ...users ] = await ethers.getSigners();
        console.log("Deployer: ", owner.address);

        recepients = [];
        amount = ethers.utils.parseUnits("10", 18);
        for(let i = 0; i < 5; i++) {
            recepients.push({
                address: users[i].address,
                value: amount.toString(),
            });
        }
        merkleTree = generateTree(recepients);
        merkleRoot = merkleTree.getHexRoot();
        console.log("Merkle root: ", merkleRoot);

        badRecepients = [];
        for(let i = 5; i < 10; i++) {
            badRecepients.push({
                address: users[i].address,
                value: amount.toString()
            });
        }
        badTree = generateTree(badRecepients);

        const Airdrop = await ethers.getContractFactory("MerkleAirdrop");
        airdrop = await Airdrop.deploy(merkleRoot);
        await airdrop.deployed();

        console.log("Merkle Airdrop Token deployed at:", airdrop.address);
    });

    describe("Function claim", () => {
        let leaf;
        let proof;
        it("should let user added in merkle tree to claim tokens", async () => {
            leaf = generateLeaf(recepients[0].address, recepients[0].value);
            proof = merkleTree.getHexProof(leaf);

            await expect(
                airdrop.claim(recepients[0].address, amount, proof)
            ).to.changeTokenBalance(airdrop, users[0], amount);
        });

        it("should revert if user is not in merkle tree", async () => {
            leaf = generateLeaf(badRecepients[0].address, badRecepients[0].value);
            proof = badTree.getHexProof(leaf);

            await expect(
                airdrop.claim(badRecepients[0].address, amount, proof)
            ).to.be.revertedWith("Not in merkle tree");
        });

        it("should revert if user try to claim twice", async () => {
            leaf = generateLeaf(recepients[0].address, recepients[0].value);
            proof = merkleTree.getHexProof(leaf);

            await expect(
                airdrop.claim(recepients[0].address, amount, proof)
            ).to.be.revertedWith("Already claimed");
        });
    });
});