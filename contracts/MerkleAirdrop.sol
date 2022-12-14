// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {MerkleProof} from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @dev A contract that allows recipients to claim tokens via 'merkle airdrop'.
 */
contract MerkleAirdrop is ReentrancyGuard {
    using SafeERC20 for IERC20;

    error AirdropInActive();
    error NotInMerkleTree();
    error AlreadyClaimed();
    error NotOwner();
    error ZeroMerkleRoot();
    error ZeroAddress();
    error NotContract();

    address private owner;
    address private sender;
    IERC20 private token;
    bytes32 private merkleRoot;

    mapping(address => uint8) private _claimed;

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
    ) external {
        onlyOwner();
        setSender(_sender);
        setToken(_token);
        setMerkleRoot(_merkleRoot);
    }

    /**
     * @dev Claims airdropped tokens.
     * @param amount The amount of the claim being made.
     * @param proof A merkle proof proving the claim is valid.
     */
    function claim(
        uint amount,
        bytes32[] calldata proof
    ) external nonReentrant {
        if (
            sender == address(0) ||
            address(token) == address(0) ||
            merkleRoot == bytes32(0)
        ) revert AirdropInActive();

        if (_claimed[msg.sender] != 0) revert AlreadyClaimed();

        // Verify merkle proof, or revert if not in tree
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, amount));
        bool isValidLeaf = MerkleProof.verify(proof, merkleRoot, leaf);

        if (!isValidLeaf) {
            revert NotInMerkleTree();
        }

        // Set address to claimed
        _claimed[msg.sender] = 1;

        // Transfer tokens to msg.sender address
        token.safeTransferFrom(sender, msg.sender, amount);

        // Emit claim event
        emit Claimed(msg.sender, amount);
    }

    function setMerkleRoot(bytes32 _merkleRoot) public {
        onlyOwner();
        if (_merkleRoot == bytes32(0)) revert ZeroMerkleRoot();
        merkleRoot = _merkleRoot;
    }

    function setToken(address _token) public {
        onlyOwner();
        if (_token == address(0)) revert ZeroAddress();
        if (_token.code.length <= 0) revert NotContract();
        token = IERC20(_token);
    }

    function setSender(address _sender) public {
        onlyOwner();
        if (_sender == address(0)) revert ZeroAddress();
        sender = _sender;
    }

    function hasClaimed(address claimant) public view returns (bool) {
        if (_claimed[claimant] == 0) return false;
        return true;
    }

    function getToken() public view returns (address) {
        return address(token);
    }

    function getSender() public view returns (address) {
        return sender;
    }

    function getMerkleRoot() public view returns (bytes32) {
        return merkleRoot;   
    }

    function onlyOwner() internal view {
        if (msg.sender != owner) revert NotOwner();
    }
}
