import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";
import "hardhat-contract-sizer";
import { config as dotenv } from "dotenv";

dotenv();

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545/",
    },
    truffle: {
      url: "http://localhost:24012/rpc",
    },
    goerli: {
      chainId: 5,
      url: `${process.env.ALCHEMY_GOERLI_API}`,
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
    mumbai: {
      chainId: 80001,
      url: `${process.env.ALCHEMY_MUMBAI_API}`,
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
  },
  etherscan: {
    apiKey: {
      goerli: `${process.env.ETHERSCAN_API}`
    }
  },
};

export default config;
