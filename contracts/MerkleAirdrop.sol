// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {MerkleProof} from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
/**
 * @dev A contract allow recipients to claim tokens via merkle airdrop.
 */
contract MerkleAirdrop is ERC20 {
    bytes32 public immutable merkleRoot;

    mapping(address => bool) public hasClaimed; // use uint8

    event Claimed(address indexed to, uint amount);

    /**
     * @dev Constructor
     * @param _merkleRoot The root of the merkle tree contraining the selected recipients
     */
    constructor(bytes32 _merkleRoot) ERC20("Merkle Airdrop Token", "MAT") {
        merkleRoot = _merkleRoot;
    }

    /**
     * @dev Claims airdropped tokens.
     * @param to The account being claimed for.
     * @param amount The amount of the claim being made.
     * @param proof A merkle proof proving the claim is valid.
     */
    // to not required
    // msg.sender
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

    // setMerkleRoot
}
