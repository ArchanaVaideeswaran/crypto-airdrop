import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumberish } from "ethers";
import { ethers } from "hardhat";
import MerkleTree from "merkletreejs";
import {
    generateLeaf,
    generateTree,
    Recipient,
} from "../scripts/merkle-tree-generator";
import { MerkleAirdrop, TokenXP } from "../typechain-types";

describe("Merkle Airdrop Token", () => {
    let owner: SignerWithAddress;
    let spender: SignerWithAddress;
    let users: SignerWithAddress[];
    let token: TokenXP;
    let airdrop: MerkleAirdrop;
    let recepients: Recipient[];
    let amount: BigNumberish;
    let merkleTree: MerkleTree;
    let merkleRoot: string;
    let badRecepients: Recipient[];
    let badTree: MerkleTree;

    before(async () => {
        [owner, spender, ...users] = await ethers.getSigners();
        console.log("Deployer: ", owner.address);

        recepients = [];
        amount = ethers.utils.parseUnits("10", 18);
        for (let i = 0; i < 5; i++) {
            recepients.push({
                address: users[i].address,
                value: amount.toString(),
            });
        }
        merkleTree = generateTree(recepients);
        merkleRoot = merkleTree.getHexRoot();
        console.log("Merkle root: ", merkleRoot);

        badRecepients = [];
        for (let i = 5; i < 10; i++) {
            badRecepients.push({
                address: users[i].address,
                value: amount.toString(),
            });
        }
        badTree = generateTree(badRecepients);
    });

    beforeEach(async () => {
        const Token = await ethers.getContractFactory("TokenXP");
        token = await Token.connect(spender).deploy();
        await token.connect(spender).deployed();

        console.log("Token deployed at: ", token.address);

        const Airdrop = await ethers.getContractFactory("MerkleAirdrop");
        airdrop = await Airdrop.deploy();
        await airdrop.deployed();

        console.log("Merkle Airdrop Token deployed at:", airdrop.address);
    });

    describe("Function initialize", () => {
        it("should not let other than owner to initialize", async () => {
            await expect(
                airdrop
                    .connect(spender)
                    .initialize(spender.address, token.address, merkleRoot)
            ).to.be.revertedWithCustomError(airdrop, "NotOwner");
        });

        it("should let owner to initialize the contract", async () => {
            await expect(
                airdrop.initialize(spender.address, token.address, merkleRoot)
            ).not.to.be.reverted;
        });
    });

    describe("Function claim", () => {
        let leaf;
        let proof;
        let tx;
        it("should revert if airdrop is inactive", async () => {
            leaf = generateLeaf(recepients[0].address, recepients[0].value);
            proof = merkleTree.getHexProof(leaf);

            await expect(
                airdrop.connect(users[0]).claim(amount, proof)
            ).to.be.revertedWithCustomError(airdrop, "AirdropInActive");
        });

        it("should revert if user is not in merkle tree", async () => {
            await airdrop.initialize(
                spender.address,
                token.address,
                merkleRoot
            );

            leaf = generateLeaf(
                badRecepients[0].address,
                badRecepients[0].value
            );
            proof = badTree.getHexProof(leaf);

            await expect(
                airdrop.connect(users[5]).claim(amount, proof)
            ).to.be.revertedWithCustomError(airdrop, "NotInMerkleTree");
        });

        it("should revert if user already claimed", async () => {
            let balance = await token.balanceOf(spender.address);
            tx = await token
                .connect(spender)
                .approve(airdrop.address, balance);
            await tx.wait();
            
            await airdrop.initialize(
                spender.address,
                token.address,
                merkleRoot
            );

            leaf = generateLeaf(recepients[0].address, recepients[0].value);
            proof = merkleTree.getHexProof(leaf);

            tx = await airdrop.connect(users[0]).claim(amount, proof);
            await tx.wait();

            await expect(
                airdrop.connect(users[0]).claim(amount, proof)
            ).to.be.revertedWithCustomError(airdrop, "AlreadyClaimed");
        });

        it("should let user added in merkle tree to claim tokens", async () => {
            let balance = await token.balanceOf(spender.address);
            tx = await token
                .connect(spender)
                .approve(airdrop.address, balance);
            await tx.wait();
            
            await airdrop.initialize(
                spender.address,
                token.address,
                merkleRoot
            );

            leaf = generateLeaf(recepients[0].address, recepients[0].value);
            proof = merkleTree.getHexProof(leaf);

            await expect(
                airdrop.connect(users[0]).claim(amount, proof)
            ).to.changeTokenBalance(token, users[0], amount);
        });
    });
});
