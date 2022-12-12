# Airdrop crypto using merkle proof

## About

<!-- add assumptions merkle root is immutable -->
MerkleAirdrop is an ERC20 token contract which lets users to claim the token if they prove that they are a part of the merkle tree.

You can generate your own merkle tree using [merkle-tree-generator](./scripts/merkle-tree-generator.ts) which uses [merkletreejs](https://www.npmjs.com/package/merkletreejs) library, by passing in a list of recepients (refer [airdrop.json](./airdrop.json)).

MerkleAirdrop.sol deployed at: [0xaF33CECbA540A93960c4379e0F834f526893708e](https://goerli.etherscan.io/address/0xaF33CECbA540A93960c4379e0F834f526893708e#code)

## Installation

```console
npm install
```

## Usage

### Compile

```console
npx hardhat compile
```

### Test

```console
npx hardhat test
```

### Contract Size

```console
npx hardhat size-contracts
```

### Typechain

Compile the contracts and generate typechain types

```console
npx hardhat compile
```

### Coverage

```console
npx hardhat coverage
```

### Clean

Delete the smart contract artifacts, the coverage reports and the Hardhat cache:

```console
npx hardhat clean
```

### Verify

Passing constructor params as command line arguments if any exists

```console
npx hardhat verify --network <network_name> <deployed_contract_address> <constructor params>
```

OR

Passing a file with constructor params to --constructor args flag

```console
npx hardhat verify --network <network_name> <deployed_contract_address> --constructor-args verify/contract.args.ts
```

For multiple arguments, follow this [guide](https://hardhat.org/plugins/nomiclabs-hardhat-etherscan.html#multiple-api-keys-and-alternative-block-explorers).

### Flatten

```console
npx hardhat flatten ./contracts/MerkleAirdrop.sol > ./flatten/MerkleAirdorp.sol
```

Then, the file can be used to upload the code manually (click on 'Contract' tab >> verify and publish) or using script (with Block explorer API as per the network)

### Deploy

- Environment variables: Create a `.env` file with its values in [.env.example](./.env.example)

#### localhost

Run hardhat node in one terminal and run the deploy script in another terminal.

```console
npx hardhat node
```

```console
npx hardhat run scripts/deploy-airdrop.ts --network localhost
```

#### Goerli Testnet

- Deploy the contracts

```console
npx hardhat run scripts/deploy-airdrop.ts --network goerli
```

## Reports

Checkout [Reports.md](./Reports.md)