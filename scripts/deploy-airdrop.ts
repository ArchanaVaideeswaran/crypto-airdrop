import { ethers } from "hardhat";
import { Recepient, generateTree, generateLeaf } from "./merkle-tree-generator";
import * as fs from "fs";


async function main() {
    console.log("\n----------Deploying Merkle Airdrop Token----------\n");

    const [ owner, ...accounts ] = await ethers.getSigners();
    console.log("Deployer: ", owner.address);
    
    const decimals = 18;
    let recepients: Recepient[] = [];
    for(let i = 0; i < 5; i++) {
        const user = accounts[i];
        recepients.push({
            address: user.address, 
            value: ethers.utils.parseUnits("10", decimals).toString()
        });
    }
    const merkleTree = generateTree(recepients);
    const merkleRoot = merkleTree.getHexRoot();

    console.log("main(): Merkle root: ", merkleRoot);

    const Airdrop = await ethers.getContractFactory("MerkleAirdrop");
    const airdrop = await Airdrop.deploy(merkleRoot);
    await airdrop.deployed();

    storeContract(
        airdrop.address, 
        Airdrop.interface.format("json"),
        "MerkleAirdrop"
    );

    console.log("\n----------Deployed Merkle Airdrop Token----------\n");
    console.log("Merkle Airdrop Token deployed at: ", airdrop.address);
}

function storeContract(address: string, abi: string | string[], name: string, network?: string) {
    // ----------------- MODIFIED FOR SAVING DEPLOYMENT DATA ----------------- //
  
    /**
     * @summary A build folder will be created in the root directory of the project
     * where the ABI, bytecode and the deployed address will be saved inside a JSON file.
     */
  
    const output = {
        address,
        abi,
    };
  
    if(network) {
      fs.mkdir(`./build/${network}/`, { recursive: true }, (err) => {
        if (err) console.error(err);
      });
      fs.writeFileSync(
        `./build/${network}/${name}.json`, 
        JSON.stringify(output)
      );
    }
    else {
      fs.mkdir(`./build/localhost/`, { recursive: true }, (err) => {
        if (err) console.error(err);
      });
      fs.writeFileSync(
        `./build/localhost/${name}.json`, 
        JSON.stringify(output)
      );
    }
  
    // ----------------------------------------------------------------------- //
}
  

main();