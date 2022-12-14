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

    address private _owner;
    address private _sender;
    IERC20 private _token;
    bytes32 private _merkleRoot;

    mapping(address => uint8) private _claimed;

    event Claimed(address indexed claimant, uint amount);

    /**
     * @dev Constructor
     */
    constructor() {
        _owner = msg.sender;
    }

    /**
     * @dev initialzer
     * @param sender The account from which the tokens are airdropped.
     * @param token The address of the airdrop token.
     * @param merkleRoot The root of the merkle tree contraining the selected recipients
     */
    function initialize(
        address sender,
        address token,
        bytes32 merkleRoot
    ) external {
        setSender(sender);
        setToken(token);
        setMerkleRoot(merkleRoot);
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
            _sender == address(0) ||
            address(_token) == address(0) ||
            _merkleRoot == bytes32(0)
        ) revert AirdropInActive();

        if (_claimed[msg.sender] != 0) revert AlreadyClaimed();

        // Verify merkle proof, or revert if not in tree
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, amount));
        bool isValidLeaf = MerkleProof.verify(proof, _merkleRoot, leaf);

        if (!isValidLeaf) revert NotInMerkleTree();

        // Set address to claimed
        _claimed[msg.sender] = 1;

        // Transfer tokens to msg.sender address
        _token.safeTransferFrom(_sender, msg.sender, amount);

        // Emit claim event
        emit Claimed(msg.sender, amount);
    }

    function setMerkleRoot(bytes32 merkleRoot) public {
        onlyOwner();
        if (_merkleRoot == bytes32(0)) revert ZeroMerkleRoot();
        _merkleRoot = merkleRoot;
    }

    function setToken(address token) public {
        onlyOwner();
        if (token == address(0)) revert ZeroAddress();
        if (token.code.length <= 0) revert NotContract();
        _token = IERC20(token);
    }

    function setSender(address sender) public {
        onlyOwner();
        if (sender == address(0)) revert ZeroAddress();
        _sender = sender;
    }

    function hasClaimed(address claimant) external view returns (bool) {
        if (_claimed[claimant] == 0) return false;
        return true;
    }

    function getToken() external view returns (address) {
        return address(_token);
    }

    function getSender() external view returns (address) {
        return _sender;
    }

    function getMerkleRoot() external view returns (bytes32) {
        return _merkleRoot;
    }

    function onlyOwner() internal view {
        if (msg.sender != _owner) revert NotOwner();
    }
}
