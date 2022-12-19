import { ethers } from "hardhat";
const { accounts } = require("../airdrop.json");

let proofs: any;

async function main() {
    const [user0, ...users] = await ethers.getSigners();

    let network = (await ethers.provider.getNetwork()).name;
    network = network == "unknown" ? "localhost" : network;

    proofs = require(`../proofs-${network}.json`);

    const TokenXP = require(`../build/${network}/TokenXP.json`);
    const token = await ethers.getContractAt("TokenXP", TokenXP.address);

    const decimals = await token.decimals();
    let amount: any = ethers.utils.parseUnits("10", decimals);

    const Airdrop = require(`../build/${network}/MerkleAirdrop.json`);
    const airdrop = await ethers.getContractAt(
        "MerkleAirdrop",
        Airdrop.address
    );

    let tx;
    let proof;
    if (network == "goerli") {
        proof = getProof(user0.address);
        amount = getValue(user0.address);
        amount = ethers.utils.parseUnits(amount, decimals);
        console.log({ address: user0.address, proof });
        if (proof.length != 0) {
            try {
                tx = await airdrop
                    .connect(user0)
                    .claim(amount, proof)
                    .catch((err: any) => {
                        throw err;
                    });

                tx = await tx.wait();
                console.log(user0.address, " claimed token successfully");
            } catch (err) {
                console.log(err);
            }
        }
    } else if (network == "localhost") {
        for (let i = 0; i < 5; i++) {
            let tx;
            let user = users[i];
            proof = getProof(user.address);
            if (proof.length != 0) {
                try {
                    tx = await airdrop
                        .connect(user)
                        .claim(amount, proof)
                        .catch((err: any) => {
                            throw err;
                        });

                    tx = await tx.wait();
                    console.log(user.address, " claimed token successfully");
                } catch (err) {
                    console.log(err);
                }
            }
        }
    }
}

function getProof(address: string) {
    proofs = proofs.proofs;
    for (let i = 0; i < proofs.length; i++) {
        let res = proofs[i];
        if (res.address == address) return res.proof;
    }
    return [];
}

function getValue(address: string) {
    for (let i = 0; i < accounts.length; i++) {
        let res = accounts[i];
        if (res.address == address) return res.value;
    }
    return;
}

main();
