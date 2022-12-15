import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumberish, Bytes, BytesLike } from "ethers";
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
    let sender: SignerWithAddress;
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
        [owner, sender, ...users] = await ethers.getSigners();
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
        token = await Token.connect(sender).deploy();
        await token.connect(sender).deployed();

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
                    .connect(sender)
                    .initialize(sender.address, token.address, merkleRoot)
            ).to.be.revertedWithCustomError(airdrop, "NotOwner");
        });

        it("should revert if initialized with zero merkle root", async () => {
            let zeroMerkleRoot =
                "0x0000000000000000000000000000000000000000000000000000000000000000";
            await expect(
                airdrop.initialize(
                    sender.address,
                    token.address,
                    zeroMerkleRoot
                )
            ).to.be.revertedWithCustomError(airdrop, "ZeroMerkleRoot");
        });

        it("should revert if initialized with zero address for sender", async () => {
            await expect(
                airdrop.initialize(
                    ethers.constants.AddressZero,
                    token.address,
                    merkleRoot
                )
            ).to.be.revertedWithCustomError(airdrop, "ZeroAddress");
        });

        it("should revert if initialized with zero address for token", async () => {
            await expect(
                airdrop.initialize(
                    sender.address,
                    ethers.constants.AddressZero,
                    merkleRoot
                )
            ).to.be.revertedWithCustomError(airdrop, "ZeroAddress");
        });

        it("should revert if initialized with non contract address for token", async () => {
            await expect(
                airdrop.initialize(
                    sender.address,
                    sender.address, // token address
                    merkleRoot
                )
            ).to.be.revertedWithCustomError(airdrop, "NotContract");
        });

        it("should let owner to initialize the contract", async () => {
            await expect(
                airdrop.initialize(sender.address, token.address, merkleRoot)
            )
                .to.emit(airdrop, "SenderChanged")
                .to.emit(airdrop, "TokenChanged")
                .to.emit(airdrop, "MerkleRootChanged");

            expect(await airdrop.getSender()).to.be.equal(sender.address);
            expect(await airdrop.getMerkleRoot()).to.be.equal(merkleRoot);
            expect(await airdrop.getToken()).to.be.equal(token.address);
        });

        it("should only initialize the given value", async () => {
            await expect(
                airdrop.initialize(sender.address, token.address, merkleRoot)
            )
                .to.emit(airdrop, "SenderChanged")
                .to.emit(airdrop, "TokenChanged")
                .to.emit(airdrop, "MerkleRootChanged");

            await expect(
                airdrop.initialize(
                    sender.address,
                    token.address,
                    badTree.getHexRoot()
                )
            )
                .to.emit(airdrop, "MerkleRootChanged")
                .not.to.emit(airdrop, "SenderChanged")
                .not.to.emit(airdrop, "TokenChanged");

            await expect(
                airdrop.initialize(
                    users[0].address,
                    token.address,
                    badTree.getHexRoot()
                )
            )
                .to.emit(airdrop, "SenderChanged")
                .not.to.emit(airdrop, "TokenChanged")
                .not.to.emit(airdrop, "MerkleRootChanged");
            
            const NewToken = await ethers.getContractFactory("TokenDAI");
            const newToken = await NewToken.deploy();
            newToken.deployed();
            
            await expect(
                airdrop.initialize(
                    users[0].address,
                    newToken.address,
                    badTree.getHexRoot()
                )
            )
                .to.emit(airdrop, "TokenChanged")
                .not.to.emit(airdrop, "SenderChanged")
                .not.to.emit(airdrop, "MerkleRootChanged");
        });

        it("should not emit any changed events",async () => {
            await expect(
                airdrop.initialize(sender.address, token.address, merkleRoot)
            )
                .to.emit(airdrop, "SenderChanged")
                .to.emit(airdrop, "TokenChanged")
                .to.emit(airdrop, "MerkleRootChanged");
            
            await expect(
                airdrop.initialize(sender.address, token.address, merkleRoot)
            )
                .not.to.emit(airdrop, "SenderChanged")
                .not.to.emit(airdrop, "TokenChanged")
                .not.to.emit(airdrop, "MerkleRootChanged");
        })
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
            await airdrop.initialize(sender.address, token.address, merkleRoot);

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
            let balance = await token.balanceOf(sender.address);
            tx = await token.connect(sender).approve(airdrop.address, balance);
            await tx.wait();

            await airdrop.initialize(sender.address, token.address, merkleRoot);

            leaf = generateLeaf(recepients[0].address, recepients[0].value);
            proof = merkleTree.getHexProof(leaf);

            tx = await airdrop.connect(users[0]).claim(amount, proof);
            await tx.wait();

            expect(await airdrop.hasClaimed(users[0].address)).to.equal(true);

            await expect(
                airdrop.connect(users[0]).claim(amount, proof)
            ).to.be.revertedWithCustomError(airdrop, "AlreadyClaimed");
        });

        it("should let user added in merkle tree to claim tokens", async () => {
            let balance = await token.balanceOf(sender.address);
            tx = await token.connect(sender).approve(airdrop.address, balance);
            await tx.wait();

            await airdrop.initialize(sender.address, token.address, merkleRoot);

            leaf = generateLeaf(recepients[2].address, recepients[0].value);
            proof = merkleTree.getHexProof(leaf);

            await expect(
                airdrop.connect(users[2]).claim(amount, proof)
            ).to.changeTokenBalance(token, users[2], amount);

            expect(await airdrop.hasClaimed(users[2].address)).to.equal(true);
        });
    });
});
