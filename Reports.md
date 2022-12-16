# Reports

## Coverage

```console
/crypto-airdrop
$ npx hardhat coverage

Version
=======
> solidity-coverage: v0.8.2

Instrumenting for coverage...
=============================

> MerkleAirdrop.sol
> TokenDAI.sol
> TokenXP.sol

Compilation:
============

(node:19792) ExperimentalWarning: stream/web is an experimental feature. This feature could change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
Generating typings for: 12 artifacts in dir: typechain-types for target: ethers-v5
Successfully generated 32 typings!
Compiled 12 Solidity files successfully

Network Info
============
> HardhatEVM: v2.12.3
> network:    hardhat



  Merkle Airdrop Token
Deployer:  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Merkle root:  0xa5255d38c57fbc3da107493eda9fd013d3f14fa0e98e001321d331e94ce9fb38
    Function initialize
Token deployed at:  0x8464135c8F25Da09e49BC8782676a84730C318bC
Merkle Airdrop Token deployed at: 0x5FbDB2315678afecb367f032d93F642f64180aa3
      ✔ should not let other than owner to initialize (45ms)
Token deployed at:  0x948B3c65b89DF0B4894ABE91E6D02FE579834F8F
Merkle Airdrop Token deployed at: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
      ✔ should revert if initialized with zero merkle root
Token deployed at:  0x712516e61C8B383dF4A63CFe83d7701Bce54B03e
Merkle Airdrop Token deployed at: 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
      ✔ should revert if initialized with zero address for sender
Token deployed at:  0xbCF26943C0197d2eE0E5D05c716Be60cc2761508
Merkle Airdrop Token deployed at: 0x5FC8d32690cc91D4c39d9d3abcBD16989F875707
      ✔ should revert if initialized with zero address for token
Token deployed at:  0x59F2f1fCfE2474fD5F0b9BA1E73ca90b143Eb8d0
Merkle Airdrop Token deployed at: 0xa513E6E4b8f2a923D98304ec87F64353C4D5C853
      ✔ should revert if initialized with non contract address for token
Token deployed at:  0xC6bA8C3233eCF65B761049ef63466945c362EdD2
Merkle Airdrop Token deployed at: 0x8A791620dd6260079BF849Dc5567aDC3F2FdC318
      ✔ should let owner to initialize the contract (38ms)
Token deployed at:  0x1275D096B9DBf2347bD2a131Fb6BDaB0B4882487
Merkle Airdrop Token deployed at: 0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e
      ✔ should only initialize the given value (85ms)
Token deployed at:  0x05Aa229Aec102f78CE0E852A812a388F076Aa555
Merkle Airdrop Token deployed at: 0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE
      ✔ should not emit any changed events
    Function claim
Token deployed at:  0x0b48aF34f4c854F5ae1A3D587da471FeA45bAD52
Merkle Airdrop Token deployed at: 0xc6e7DF5E7b4f2A278906862b61205850344D4e7d
      ✔ should revert if airdrop is inactive
Token deployed at:  0x0f5D1ef48f12b6f691401bfe88c2037c690a6afe
Merkle Airdrop Token deployed at: 0x59b670e9fA9D0A427751Af201D676719a970857b
      ✔ should revert if user is not in merkle tree (50ms)
Token deployed at:  0x90118d110B07ABB82Ba8980D1c5cC96EeA810d2C
Merkle Airdrop Token deployed at: 0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44
      ✔ should return false if not claimed
Token deployed at:  0xcA03Dc4665A8C3603cb4Fd5Ce71Af9649dC00d44
Merkle Airdrop Token deployed at: 0xa85233C63b9Ee964Add6F2cffe00Fd84eb32338f
      ✔ should revert if user already claimed (76ms)
Token deployed at:  0x73eccD6288e117cAcA738BDAD4FEC51312166C1A
Merkle Airdrop Token deployed at: 0x7a2088a1bFc9d81c55368AE168C2C02570cB814F
      ✔ should let user added in merkle tree to claim tokens (84ms)


  13 passing (2s)

--------------------|----------|----------|----------|----------|----------------|
File                |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
--------------------|----------|----------|----------|----------|----------------|
 contracts\         |      100 |    86.67 |      100 |      100 |                |
  MerkleAirdrop.sol |      100 |    86.67 |      100 |      100 |                |
  TokenDAI.sol      |      100 |      100 |      100 |      100 |                |
  TokenXP.sol       |      100 |      100 |      100 |      100 |                |
--------------------|----------|----------|----------|----------|----------------|
All files           |      100 |    86.67 |      100 |      100 |                |
--------------------|----------|----------|----------|----------|----------------|

> Istanbul reports written to ./coverage/ and ./coverage.json
```
## Contract Size

```console
/crypto-airdrop
$ npx hardhat size-contracts
(node:21244) ExperimentalWarning: stream/web is an experimental feature. This feature could change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
Generating typings for: 12 artifacts in dir: typechain-types for target: ethers-v5
Successfully generated 32 typings!
Compiled 12 Solidity files successfully
 ·-----------------|--------------|----------------·
 |  Contract Name  ·  Size (KiB)  ·  Change (KiB)  │
 ··················|··············|·················
 |  Address        ·       0.084  ·                │
 ··················|··············|·················
 |  MerkleProof    ·       0.084  ·                │
 ··················|··············|·················
 |  SafeERC20      ·       0.084  ·                │
 ··················|··············|·················
 |  TokenXP        ·       2.080  ·                │
 ··················|··············|·················
 |  TokenDAI       ·       2.080  ·                │
 ··················|··············|·················
 |  ERC20          ·       2.080  ·                │
 ··················|··············|·················
 |  MerkleAirdrop  ·       2.627  ·                │
 ·-----------------|--------------|----------------·
```

## Slither Security Analysis

```console
/crypto-airdrop
$ slither .
'npx hardhat compile --force' running
Generating typings for: 12 artifacts in dir: typechain-types for target: ethers-v5
Successfully generated 32 typings!
Compiled 12 Solidity files successfully

(node:21544) ExperimentalWarning: stream/web is an experimental feature. This feature could change at any time
(Use `node --trace-warnings ...` to show where the warning was created)


MerkleAirdrop.claim(uint256,bytes32[]) (contracts/MerkleAirdrop.sol#64-90) uses arbitrary from in transferFrom: _token.safeTransferFrom(_sender,msg.sender,amount) (contracts/MerkleAirdrop.sol#86)
Reference: https://github.com/trailofbits/slither/wiki/Detector-Documentation#arbitrary-send-erc20

Reentrancy in MerkleAirdrop.claim(uint256,bytes32[]) (contracts/MerkleAirdrop.sol#64-90):
        External calls:
        - _token.safeTransferFrom(_sender,msg.sender,amount) (contracts/MerkleAirdrop.sol#86)
        Event emitted after the call(s):
        - Claimed(msg.sender,amount) (contracts/MerkleAirdrop.sol#89)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#reentrancy-vulnerabilities-3

Address._revert(bytes,string) (node_modules/@openzeppelin/contracts/utils/Address.sol#231-243) uses assembly
        - INLINE ASM (node_modules/@openzeppelin/contracts/utils/Address.sol#236-239)
MerkleProof._efficientHash(bytes32,bytes32) (node_modules/@openzeppelin/contracts/utils/cryptography/MerkleProof.sol#215-222) uses assembly
        - INLINE ASM (node_modules/@openzeppelin/contracts/utils/cryptography/MerkleProof.sol#217-221)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#assembly-usage

Different versions of Solidity are used:
        - Version used: ['0.8.17', '^0.8.0', '^0.8.1']
        - ^0.8.0 (node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol#4)
        - ^0.8.0 (node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol#4)
        - ^0.8.0 (node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol#4)
        - ^0.8.0 (node_modules/@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol#4)
        - ^0.8.0 (node_modules/@openzeppelin/contracts/token/ERC20/extensions/draft-IERC20Permit.sol#4)
        - ^0.8.0 (node_modules/@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol#4)
        - ^0.8.1 (node_modules/@openzeppelin/contracts/utils/Address.sol#4)
        - ^0.8.0 (node_modules/@openzeppelin/contracts/utils/Context.sol#4)
        - ^0.8.0 (node_modules/@openzeppelin/contracts/utils/cryptography/MerkleProof.sol#4)
        - 0.8.17 (contracts/MerkleAirdrop.sol#2)
        - 0.8.17 (contracts/TokenDAI.sol#2)
        - 0.8.17 (contracts/TokenXP.sol#2)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#different-pragma-directives-are-used

Pragma version^0.8.0 (node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol#4) allows old versions
Pragma version^0.8.0 (node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol#4) allows old versions
Pragma version^0.8.0 (node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol#4) allows old versions
Pragma version^0.8.0 (node_modules/@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol#4) allows old versions
Pragma version^0.8.0 (node_modules/@openzeppelin/contracts/token/ERC20/extensions/draft-IERC20Permit.sol#4) allows old versions
Pragma version^0.8.0 (node_modules/@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol#4) allows old versions      
Pragma version^0.8.1 (node_modules/@openzeppelin/contracts/utils/Address.sol#4) allows old versions
Pragma version^0.8.0 (node_modules/@openzeppelin/contracts/utils/Context.sol#4) allows old versions
Pragma version^0.8.0 (node_modules/@openzeppelin/contracts/utils/cryptography/MerkleProof.sol#4) allows old versions   
Pragma version0.8.17 (contracts/MerkleAirdrop.sol#2) necessitates a version too recent to be trusted. Consider deploying with 0.6.12/0.7.6/0.8.16
Pragma version0.8.17 (contracts/TokenDAI.sol#2) necessitates a version too recent to be trusted. Consider deploying with 0.6.12/0.7.6/0.8.16
Pragma version0.8.17 (contracts/TokenXP.sol#2) necessitates a version too recent to be trusted. Consider deploying with 0.6.12/0.7.6/0.8.16
solc-0.8.17 is not recommended for deployment
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#incorrect-versions-of-solidity

Low level call in Address.sendValue(address,uint256) (node_modules/@openzeppelin/contracts/utils/Address.sol#60-65):   
        - (success) = recipient.call{value: amount}() (node_modules/@openzeppelin/contracts/utils/Address.sol#63)      
Low level call in Address.functionCallWithValue(address,bytes,uint256,string) (node_modules/@openzeppelin/contracts/utils/Address.sol#128-137):
        - (success,returndata) = target.call{value: value}(data) (node_modules/@openzeppelin/contracts/utils/Address.sol#135)
Low level call in Address.functionStaticCall(address,bytes,string) (node_modules/@openzeppelin/contracts/utils/Address.sol#155-162):
        - (success,returndata) = target.staticcall(data) (node_modules/@openzeppelin/contracts/utils/Address.sol#160)  
Low level call in Address.functionDelegateCall(address,bytes,string) (node_modules/@openzeppelin/contracts/utils/Address.sol#180-187):
        - (success,returndata) = target.delegatecall(data) (node_modules/@openzeppelin/contracts/utils/Address.sol#185)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#low-level-calls

Function IERC20Permit.DOMAIN_SEPARATOR() (node_modules/@openzeppelin/contracts/token/ERC20/extensions/draft-IERC20Permit.sol#59) is not in mixedCase
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#conformance-to-solidity-naming-conventions    
. analyzed (12 contracts with 81 detectors), 23 result(s) found
```

## Deployments

```console
/crypto-airdrop
$ npx hardhat run scripts/deploy-airdrop.ts --network truffle
(node:4988) ExperimentalWarning: stream/web is an experimental feature. This feature could change at any time
(Use `node --trace-warnings ...` to show where the warning was created)

----------Deploying MerkleAirdrop----------

(node:11356) ExperimentalWarning: stream/web is an experimental feature. This feature could change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
Deployer:  0x7748329C48FE9F5Dc50f5858E174Dbc7A037117D

----------Deployed MerkleAirdrop----------

MerkleAirdrop Token deployed at:  0x764b971348f0571E8BCF2Ea2AdBB7E793d93B145
```