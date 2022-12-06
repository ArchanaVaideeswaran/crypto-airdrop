import { solidityKeccak256 } from "ethers/lib/utils";
import keccak256 from "keccak256"; // Keccak256 hashing
import MerkleTree from "merkletreejs"; // MerkleTree.js
import path from "path"
import * as fs from "fs";

export type Recepient = {
    address: string,
    value: string
};

// Output file path
const outputPath: string = path.join(__dirname, "../merkle.json");

export function generateLeaf(address: string, value: string) {
    return Buffer.from(
        // Hash in appropriate Merkle format
        solidityKeccak256(["address", "uint256"], [address, value]).slice(2),
        "hex"
    );
}

export function generateTree(recepients: Recepient[]) {
    // Generate merkle tree
    const merkleTree = new MerkleTree(
        // Generate leafs
        recepients.map(({ address, value }) =>
            generateLeaf(address, value)
        ),
        // Hashing function
        keccak256,
        { sortPairs: true }
    );

    // Collect and log merkle root
    const merkleRoot = merkleTree.getHexRoot();
    // console.log(`Generated Merkle root: ${merkleRoot}`);

    // Collect and save merkle tree + root
    fs.writeFileSync(
        // Output to merkle.json
        outputPath,
        // Root + full tree
        JSON.stringify({
            root: merkleRoot,
            tree: merkleTree
        })
    );
    return merkleTree;
}