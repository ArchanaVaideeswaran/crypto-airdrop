// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {MerkleProof} from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract MerkleAirdrop is ERC20 {
    bytes32 public immutable merkleRoot;

    mapping(address => bool) public hasClaimed;

    event Claimed(address indexed to, uint amount);

    constructor(bytes32 _merkleRoot) ERC20("Merkle Airdrop Token", "MAT") {
        merkleRoot = _merkleRoot;
    }

    function claim(address to, uint amount, bytes32[] calldata proof) external {
        require(!hasClaimed[to], "Already claimed");

        // Verify merkle proof, or revert if not in tree
        bytes32 leaf = keccak256(abi.encodePacked(to, amount));
        bool isValidLeaf = MerkleProof.verify(proof, merkleRoot, leaf);
        require(isValidLeaf, "Not in merkle tree");

        // Set address to claimed
        hasClaimed[to] = true;

        // Mint tokens to address
        _mint(to, amount);

        // Emit claim event
        emit Claimed(to, amount);
    }
}
