// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {MerkleProof} from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

/**
 * @dev A contract that allows recipients to claim tokens via 'merkle airdrop'.
 */
contract MerkleAirdrop {
    address public owner;
    address public sender;
    IERC20 public token;
    bytes32 public merkleRoot;

    mapping(address => uint8) public hasClaimed;

    event Claimed(address indexed claimant, uint amount);

    /**
     * @dev Constructor
     */
    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev initialzer
     * @param _sender The account from which the tokens are airdropped.
     * @param _token The address of the airdrop token.
     * @param _merkleRoot The root of the merkle tree contraining the selected recipients
     */
    function initialize(
        address _sender,
        address _token,
        bytes32 _merkleRoot
    ) external onlyOwner {
        setSender(_sender);
        setToken(_token);
        setMerkleRoot(_merkleRoot);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "caller not owner");
        _;
    }

    /**
     * @dev Claims airdropped tokens.
     * @param amount The amount of the claim being made.
     * @param proof A merkle proof proving the claim is valid.
     */
    function claim(uint amount, bytes32[] calldata proof) external {
        require(hasClaimed[msg.sender] != 0, "Already claimed");

        // Verify merkle proof, or revert if not in tree
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, amount));
        bool isValidLeaf = MerkleProof.verify(proof, merkleRoot, leaf);
        require(isValidLeaf, "Not in merkle tree");

        // Set addressmsg.sender claimed
        hasClaimed[msg.sender] = 1;

        // Transfer tokens to msg.sender address
        token.transferFrom(sender, msg.sender, amount);

        // Emit claim event
        emit Claimed(msg.sender, amount);
    }

    function setMerkleRoot(bytes32 _merkleRoot) public onlyOwner {
        require(_merkleRoot != bytes32(0), "merkle root cannot be zero");
        merkleRoot = _merkleRoot;
    }

    function setToken(address _token) public onlyOwner {
        require(_token != address(0), "token cannot be zero address");
        require(_token.code.length > 0, "token should be a contract");
        token = IERC20(_token);
    }

    function setSender(address _sender) public onlyOwner {
        require(_sender != address(0), "sender cannot be zero address");
        sender = _sender;
    }
}
