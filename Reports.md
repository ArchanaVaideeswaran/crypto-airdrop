# Reports

## Coverage

```console
/crypto-airdrop (main)
$ npx hardhat coverage

Version
=======
> solidity-coverage: v0.8.2

Instrumenting for coverage...
=============================

> MerkleAirdrop.sol

Compilation:
============

(node:19564) ExperimentalWarning: stream/web is an experimental feature. This feature could change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
Nothing to compile
No need to generate any newer typings.

Network Info
============
> HardhatEVM: v2.12.3
> network:    hardhat



  Merkle Airdrop Token
Deployer:  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Merkle root:  0x02e2af27bcbb0e76548f35620dc0ba3f822a0de310b8a027d0e58d1e79861078
Merkle Airdrop Token deployed at: 0x5FbDB2315678afecb367f032d93F642f64180aa3
    Function claim
      ✔ should let user added in merkle tree to claim tokens (118ms)
      ✔ should revert if user is not in merkle tree (80ms)
      ✔ should revert if user try to claim twice


  3 passing (622ms)

--------------------|----------|----------|----------|----------|----------------|
File                |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
--------------------|----------|----------|----------|----------|----------------|
 contracts\         |      100 |      100 |      100 |      100 |                |
  MerkleAirdrop.sol |      100 |      100 |      100 |      100 |                |
--------------------|----------|----------|----------|----------|----------------|
All files           |      100 |      100 |      100 |      100 |                |
--------------------|----------|----------|----------|----------|----------------|

> Istanbul reports written to ./coverage/ and ./coverage.json
```
## Deployments

```console
/crypto-airdrop (main)
$ npx hardhat run scripts/deploy-airdrop.ts --network goerli
(node:21152) ExperimentalWarning: stream/web is an experimental feature. This feature could change at any time
(Use `node --trace-warnings ...` to show where the warning was created)

----------Deploying Merkle Airdrop Token----------

Deployer:  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
main(): Merkle root:  0xe1f1b5f216049d95c5138a0e92abfa3eb6c915dc42ecbbe5524181a92ea79c9b

----------Deployed Merkle Airdrop Token----------

Merkle Airdrop Token deployed at:  0xa5267a8d2cF990702b597Aa14ab26f7312D4fb6c
```

## Contract Size

```console
/crypto-airdrop (main)
$ npx hardhat size-contracts
(node:21048) ExperimentalWarning: stream/web is an experimental feature. This feature could change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
Generating typings for: 6 artifacts in dir: typechain-types for target: ethers-v5
Successfully generated 24 typings!
Compiled 6 Solidity files successfully
 ·-----------------|--------------|----------------·
 |  Contract Name  ·  Size (KiB)  ·  Change (KiB)  │
 ··················|··············|·················
 |  MerkleProof    ·       0.084  ·                │
 ··················|··············|·················
 |  ERC20          ·       4.546  ·                │
 ··················|··············|·················
 |  MerkleAirdrop  ·       6.663  ·        -0.354  │
 ·-----------------|--------------|----------------·
```

## Slither Security Analysis

```console
/crypto-airdrop (main)
$ slither .
'npx hardhat compile --force' running
Generating typings for: 6 artifacts in dir: typechain-types for target: ethers-v5
Successfully generated 24 typings!
Compiled 6 Solidity files successfully

(node:2336) ExperimentalWarning: stream/web is an experimental feature. This feature could change at any time
(Use `node --trace-warnings ...` to show where the warning was created)


MerkleProof._efficientHash(bytes32,bytes32) (node_modules/@openzeppelin/contracts/utils/cryptography/MerkleProof.sol#215-222) uses assembly
        - INLINE ASM (node_modules/@openzeppelin/contracts/utils/cryptography/MerkleProof.sol#217-221)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#assembly-usage

Different versions of Solidity are used:
        - Version used: ['0.8.17', '^0.8.0']
        - ^0.8.0 (node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol#4)
        - ^0.8.0 (node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol#4)
        - ^0.8.0 (node_modules/@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol#4)
        - ^0.8.0 (node_modules/@openzeppelin/contracts/utils/Context.sol#4)
        - ^0.8.0 (node_modules/@openzeppelin/contracts/utils/cryptography/MerkleProof.sol#4)
        - 0.8.17 (contracts/MerkleAirdrop.sol#2)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#different-pragma-directives-are-used

Pragma version^0.8.0 (node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol#4) allows old versions
Pragma version^0.8.0 (node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol#4) allows old versions
Pragma version^0.8.0 (node_modules/@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol#4) allows old versions
Pragma version^0.8.0 (node_modules/@openzeppelin/contracts/utils/Context.sol#4) allows old versions
Pragma version^0.8.0 (node_modules/@openzeppelin/contracts/utils/cryptography/MerkleProof.sol#4) allows old versions   
Pragma version0.8.17 (contracts/MerkleAirdrop.sol#2) necessitates a version too recent to be trusted. Consider deploying with 0.6.12/0.7.6/0.8.16
solc-0.8.17 is not recommended for deployment
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#incorrect-versions-of-solidity
. analyzed (6 contracts with 81 detectors), 9 result(s) found
```